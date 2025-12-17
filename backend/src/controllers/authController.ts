import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterData, LoginCredentials, AuthRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'All fields are required: email, password, firstName, lastName',
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Password validation
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long',
        });
      }

      const registerData: RegisterData = {
        email,
        password,
        firstName,
        lastName,
      };

      const result = await AuthService.register(registerData);

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User with this email already exists') {
          return res.status(409).json({ error: error.message });
        }
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        });
      }

      const credentials: LoginCredentials = { email, password };
      const result = await AuthService.login(credentials);

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password') {
          return res.status(401).json({ error: error.message });
        }
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await AuthService.getUserById(req.userId);

      res.status(200).json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  }

  static async logout(_req: AuthRequest, res: Response) {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint exists for consistency and can be used for logging
    res.status(200).json({ message: 'Logged out successfully' });
  }
}
