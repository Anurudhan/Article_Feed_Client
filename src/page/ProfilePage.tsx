import  { useState } from 'react';
import { User, Settings, Lock, BookOpen, Save, X, Check, Edit3, Mail, Phone, Calendar } from 'lucide-react';
import PersonalInformation from '../components/Profile/PersonalInformation';
import PasswordChange from '../components/Profile/PasswordChange';
import ArticlePreferencesProfile from '../components/Article/ArticlePreferncesProfile';
import { CATEGORIES } from '../types/Article';


interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  articlePreferences: string[];
  isEmailVerified: boolean;
}


const ProfilePage = () => {
  const [user, setUser] = useState<User>({
    _id: "64a7b8c9d1e2f3g4h5i6j7k8",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    dob: "1990-05-15",
    articlePreferences: ["coffee-culture", "brewing-techniques", "bean-origins"],
    isEmailVerified: true
  });

  const [editMode, setEditMode] = useState({
    profile: false,
    password: false,
    preferences: false
  });

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    dob: user.dob,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    preferences: ''
  });

  const [tempPreferences, setTempPreferences] = useState([...user.articlePreferences]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
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
    } else if (field === 'currentPassword' && !formData.currentPassword) {
      error = 'Current password is required';
    } else if (field === 'newPassword' && formData.newPassword.length < 8) {
      error = 'Password must be at least 8 characters';
    } else if (field === 'confirmPassword' && formData.newPassword !== formData.confirmPassword) {
      error = 'Passwords do not match';
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleProfileSave = () => {
    if (Object.values(errors).some(error => error) || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fix all errors before saving');
      return;
    }
    setUser(prev => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      dob: formData.dob
    }));
    setEditMode(prev => ({ ...prev, profile: false }));
  };

  const handlePasswordSave = () => {
    if (Object.values(errors).some(error => error) || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Please fix all errors before saving');
      return;
    }
    alert("Password changed successfully!");
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setErrors(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setEditMode(prev => ({ ...prev, password: false }));
  };

  const handlePreferencesSave = () => {
    if (tempPreferences.length === 0) {
      setErrors(prev => ({ ...prev, preferences: 'Please select at least one preference' }));
      return;
    }
    setUser(prev => ({ ...prev, articlePreferences: [...tempPreferences] }));
    setErrors(prev => ({ ...prev, preferences: '' }));
    setEditMode(prev => ({ ...prev, preferences: false }));
  };

  const cancelEdit = (section: string) => {
    if (section === 'profile') {
      setFormData({
        ...formData,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        dob: user.dob
      });
      setErrors({
        ...errors,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: ''
      });
    } else if (section === 'password') {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({
        ...errors,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else if (section === 'preferences') {
      setTempPreferences([...user.articlePreferences]);
      setErrors(prev => ({ ...prev, preferences: '' }));
    }
    setEditMode(prev => ({ ...prev, [section]: false }));
  };

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
                onClick={() => setEditMode(prev => ({ ...prev, profile: !prev.profile }))}
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
                  <User className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
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
                      day: 'numeric'
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
                onClick={() => setEditMode(prev => ({ ...prev, password: !prev.password }))}
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Lock className="w-4 h-4 mr-2" />
                {editMode.password ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {editMode.password ? (
              <div>
                <PasswordChange
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
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
              onClick={() => setEditMode(prev => ({ ...prev, preferences: !prev.preferences }))}
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
                maxSelections={5}
                error={errors.preferences}
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
                  const category = CATEGORIES.find(cat => cat.id === preferenceId);
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