import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const HRProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    employeeId: '',
  });
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get profile from current user or fetch from API
      if (currentUser) {
        const hrProfile = currentUser.HRManagerProfile || {};
        setProfile({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: hrProfile.phone || '',
          designation: hrProfile.designation || 'HR Manager',
          department: hrProfile.department || 'Human Resources',
          employeeId: hrProfile.employeeId || 'N/A',
        });
        setEditedProfile({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: hrProfile.phone || '',
          designation: hrProfile.designation || 'HR Manager',
          department: hrProfile.department || 'Human Resources',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/hr/profile`,
        editedProfile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data?.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  if (loading && !profile.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card elevation={3}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'white',
                color: '#667eea',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {profile.name?.charAt(0)?.toUpperCase() || 'H'}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {profile.name || 'HR Manager'}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {profile.designation || 'HR Manager'}
              </Typography>
            </Box>
          </Box>
          {!isEditing && (
            <IconButton
              onClick={handleEdit}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#667eea', fontWeight: 600 }}>
            Profile Information
          </Typography>

          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                </Box>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {profile.name || 'N/A'}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Email Address
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="500">
                  {profile.email || 'N/A'}
                </Typography>
              </Paper>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone Number
                  </Typography>
                </Box>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {profile.phone || 'N/A'}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Employee ID */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WorkIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Employee ID
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="500">
                  {profile.employeeId || 'N/A'}
                </Typography>
              </Paper>
            </Grid>

            {/* Designation */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WorkIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Designation
                  </Typography>
                </Box>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedProfile.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {profile.designation || 'N/A'}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Department */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ color: '#667eea' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Department
                  </Typography>
                </Box>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedProfile.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {profile.department || 'N/A'}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default HRProfile;
