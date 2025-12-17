import React from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/shared/Card';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-800 mb-2">
            Profile
          </h1>
          <p className="text-neutral-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* User Info Card */}
          <Card>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif text-neutral-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Mail size={16} />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Calendar size={16} />
                    <span className="text-sm">
                      Member since {user?.createdAt && format(new Date(user.createdAt), 'MMMM yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Details */}
          <Card>
            <h3 className="text-xl font-serif text-neutral-800 mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={user?.firstName || ''}
                  disabled
                  className="input-field bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={user?.lastName || ''}
                  disabled
                  className="input-field bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-neutral-50"
                />
              </div>
            </div>
          </Card>

          {/* Premium Status */}
          <Card className="bg-gradient-to-br from-primary-light to-accent-light border-0">
            <div className="text-white">
              <h3 className="text-xl font-serif mb-2">Premium Member</h3>
              <p className="text-sm opacity-90">
                You have access to all premium features including habit tracking, workout logging, and progress photos.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
