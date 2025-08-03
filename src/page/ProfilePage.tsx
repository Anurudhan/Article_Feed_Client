import { useState } from 'react';
import { User as UserIcon, Settings, Lock, BookOpen, Save, X, Check, Edit3, Mail, Phone, Calendar, Loader } from 'lucide-react';
import PersonalInformation from '../components/Profile/PersonalInformation';
import PasswordChange from '../components/Profile/PasswordChange';
import { CATEGORIES } from '../types/Article';
import { useAuth } from '../redux/hooks/useAuth';
import type { User } from '../types/loginEntity';
import type { editUserEntity } from '../types/UserEntity';
import { useToast } from '../contexts/ToastContext';
import axiosInstance from '../components/utilities/AxiosInstance';
import type { CustomResponse } from '../components/utilities/AxiosInstance';
import ArticlePreferencesProfile from '../components/Article/ArticlePreferncesProfile';
import { useAppDispatch } from '../redux/hooks/hooks';
import { getUser } from '../redux/actions/getUser';

const ProfilePage = () => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const user = useAuth() as User | null;
  console.log(user, "this is my user 💖💖💖💖");
  const [editMode, setEditMode] = useState({
    profile: false,
    password: false,
    preferences: false,
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dob: user?.dob || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<editUserEntity>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    articlePreferences: '',
  });

  const [tempPreferences, setTempPreferences] = useState<string[]>(user?.articlePreferences || []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBlur = (field: string) => {
    let error = '';
    if (field === 'firstName' && !formData.firstName.trim()) {
      error = 'First name is required';
    } else if (field === 'lastName' && !formData.lastName.trim()) {
      error = 'Last name is required';
    } else if (field === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
      error = 'Invalid email address';
    } else if (field === 'phone' && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      error = 'Invalid phone number';
    } else if (field === 'currentPassword' && !passwordData.currentPassword) {
      error = 'Current password is required';
    } else if (field === 'newPassword' && passwordData.newPassword.length < 8) {
      error = 'Password must be at least 8 characters';
    } else if (field === 'confirmPassword' && passwordData.newPassword !== passwordData.confirmPassword) {
      error = 'Passwords do not match';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // 1. Update Personal Information
  const handleProfileSave = async () => {
    // Identify changed fields
    const changedFields = Object.keys(formData).filter(
      (key) => formData[key as keyof typeof formData] !== user?.[key as keyof User]
    );

    if (changedFields.length === 0) {
      showToast('No changes to save', 'info');
      setEditMode((prev) => ({ ...prev, profile: false }));
      return;
    }

    // Validate changed fields
    for (const field of changedFields) {
      if (field === 'firstName' && !formData.firstName.trim()) {
        setErrors((prev) => ({ ...prev, firstName: 'First name is required' }));
        return;
      }
      if (field === 'lastName' && !formData.lastName.trim()) {
        setErrors((prev) => ({ ...prev, lastName: 'Last name is required' }));
        return;
      }
      if (field === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
        return;
      }
      if (field === 'phone' && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
        setErrors((prev) => ({ ...prev, phone: 'Invalid phone number' }));
        return;
      }
      if (field === 'dob' && formData.dob && isNaN(Date.parse(formData.dob))) {
        setErrors((prev) => ({ ...prev, dob: 'Invalid date of birth format' }));
        return;
      }
    }

    try {
      // Create payload with only changed fields
      const payload = changedFields.reduce((acc, key) => ({
        ...acc,
        [key]: formData[key as keyof typeof formData]
      }), {});

      const response = await axiosInstance.patch<CustomResponse<{ user: User }>>('/profile', payload);
      showToast(response.data.message || 'Profile updated successfully', 'success');
      setEditMode((prev) => ({ ...prev, profile: false }));
      await dispatch(getUser());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('Error updating profile:', errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  // 2. Change Password
  const handlePasswordSave = async () => {
    if (
      Object.values(errors).some((error) => error) ||
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showToast('Please fix all errors before saving', 'error');
      return;
    }

    try {
      const response = await axiosInstance.patch<CustomResponse<null>>('/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast(response.data.message || 'Password updated successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setEditMode((prev) => ({ ...prev, password: false }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      console.error('Error changing password:', errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  // 3. Update Article Preferences
  const handlePreferencesSave = async () => {
    if (tempPreferences.length === 0) {
      setErrors((prev) => ({ ...prev, articlePreferences: 'Please select at least one preference' }));
      showToast('Please select at least one preference', 'error');
      return;
    }

    if (tempPreferences.length > 3) {
      setErrors((prev) => ({ ...prev, articlePreferences: 'You can select up to 3 preferences only' }));
      showToast('You can select up to 3 preferences only', 'error');
      return;
    }

    try {
      const response = await axiosInstance.patch<CustomResponse<{ preferences: string[] }>>('/preferences', {
        preferences: tempPreferences,
      });
      showToast(response.data.message || 'Preferences updated successfully', 'success');
      setErrors((prev) => ({ ...prev, articlePreferences: '' }));
      setEditMode((prev) => ({ ...prev, preferences: false }));
      await dispatch(getUser());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      console.error('Error updating preferences:', errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const cancelEdit = (section: 'profile' | 'password' | 'preferences') => {
    if (section === 'profile') {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
        dob: user?.dob || '',
      });
      setErrors((prev) => ({
        ...prev,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
      }));
    } else if (section === 'password') {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } else if (section === 'preferences') {
      setTempPreferences([...(user?.articlePreferences || [])]);
      setErrors((prev) => ({ ...prev, articlePreferences: '' }));
    }
    setEditMode((prev) => ({ ...prev, [section]: false }));
    
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <Loader className="h-8 w-8 text-amber-600 animate-spin" />
              <p
                className="text-amber-800 font-medium"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Loading your profile...
              </p>
            </div>
          </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-900 via-orange-800 to-amber-800 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 sm:mb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border border-amber-300 rounded-full"></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 border border-amber-300 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-amber-300 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left text-white">
                <div className="flex items-center justify-center sm:justify-start mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-50 tracking-wide">
                    {user.firstName} {user.lastName}
                  </h1>
                  {user.isEmailVerified && (
                    <div className="ml-3 bg-green-500 rounded-full p-1.5 shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center sm:justify-start text-amber-200 mb-2">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium break-all">{user.email}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-4 text-amber-300">
                  <span className="text-sm font-medium bg-amber-800/50 px-3 py-1 rounded-full">
                    ✍️ Article Writer
                  </span>
                  <span className="text-sm font-medium bg-amber-800/50 px-3 py-1 rounded-full">
                    📝 Content Creator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Personal Information Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-600" />
                Personal Information
              </h2>
              <button
                onClick={() => setEditMode((prev) => ({ ...prev, profile: !prev.profile }))}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editMode.profile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode.profile ? (
              <div>
                <PersonalInformation
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleProfileSave}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => cancelEdit('profile')}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <UserIcon className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
                  <span className="text-amber-900 font-medium text-base sm:text-lg">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <Mail className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
                  <span className="text-amber-900 font-medium text-base sm:text-lg break-all">{user.email}</span>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <Phone className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
                  <span className="text-amber-900 font-medium text-base sm:text-lg">{user.phone}</span>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <Calendar className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
                  <span className="text-amber-900 font-medium text-base sm:text-lg">
                    {new Date(user.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-red-600" />
                Security Settings
              </h2>
              <button
                onClick={() => setEditMode((prev) => ({ ...prev, password: !prev.password }))}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Lock className="w-4 h-4 mr-2" />
                {editMode.password ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {editMode.password ? (
              <div>
                <PasswordChange
                  formData={passwordData}
                  errors={errors}
                  onChange={handlePasswordChange}
                  onBlur={handleBlur}
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handlePasswordSave}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                  <button
                    onClick={() => cancelEdit('password')}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-amber-800 font-medium text-lg mb-2">Secure Account</p>
                <p className="text-amber-600 text-sm mb-4">
                  Click "Change Password" to update your password
                </p>
                <p className="text-xs text-amber-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Article Preferences Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6 sm:p-8 mt-6 lg:mt-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-purple-600" />
              Coffee Article Preferences
            </h2>
            <button
              onClick={() => setEditMode((prev) => ({ ...prev, preferences: !prev.preferences }))}
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode.preferences ? 'Cancel' : 'Edit Preferences'}
            </button>
          </div>

          {editMode.preferences ? (
            <div>
              <ArticlePreferencesProfile
                selectedPreferences={tempPreferences}
                onChange={setTempPreferences}
                maxSelections={3}
                error={errors.articlePreferences}
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handlePreferencesSave}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </button>
                <button
                  onClick={() => cancelEdit('preferences')}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-amber-800 mb-6 text-base sm:text-lg font-medium">
                Your current coffee article preferences:
              </p>
              <div className="flex flex-wrap gap-3">
                {user.articlePreferences.map((preferenceId) => {
                  const category = CATEGORIES.find((cat) => cat.id === preferenceId);
                  return (
                    <span
                      key={preferenceId}
                      className="px-4 py-2 bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 rounded-full text-sm sm:text-base font-semibold shadow-md border border-amber-300"
                    >
                      {category ? category.name : preferenceId}
                    </span>
                  );
                })}
              </div>
              {user.articlePreferences.length === 0 && (
                <p className="text-amber-600 italic text-center py-8 text-lg">
                  No preferences selected yet. Click "Edit Preferences" to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;