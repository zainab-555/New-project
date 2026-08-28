import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import QuickSearchModal from './components/QuickSearchModal';
import AddClassModal from './components/AddClassModal';
import AddAssignmentModal from './components/AddAssignmentModal';
import AddNoteModal from './components/AddNoteModal';
import ResourcePreviewModal from './components/ResourcePreviewModal';
import CreatePostModal from './components/CreatePostModal';

// Views
import LoginView from './views/LoginView';
import AccessDeniedView from './views/AccessDeniedView';
import HomeView from './views/HomeView';
import TimetableView from './views/TimetableView';
import AssistantView from './views/AssistantView';
import AttendanceView from './views/AttendanceView';
import AssignmentsView from './views/AssignmentsView';
import NotesView from './views/NotesView';
import CgpaView from './views/CgpaView';
import ProfileView from './views/ProfileView';

import SemesterVaultView from './views/student/SemesterVaultView';
import CommunityChatView from './views/CommunityChatView';

// Faculty Views
import FacultyHomeView from './views/faculty/FacultyHomeView';
import MarkAttendanceView from './views/faculty/MarkAttendanceView';
import UploadResourceView from './views/faculty/UploadResourceView';
import ApproveLeavesView from './views/faculty/ApproveLeavesView';
import FacultyTimetableView from './views/faculty/FacultyTimetableView';

import { storage } from './services/storage';
import {
  checkBackendHealth,
  fetchClasses,
  createClass,
  deleteClass,
  fetchVaultResources,
  createVaultResource,
  fetchCommunityPosts,
  createCommunityPost,
  likeCommunityPost,
  replyCommunityPost,
  fetchLeaves,
  submitLeaveRequest,
  updateLeaveStatus,
  saveFacultyAttendance,
} from './services/api';

export default function App() {
  // Auth State (Strict RBAC)
  const [user, setUser] = useState(storage.getAuthUser());
  const [activeScreen, setActiveScreen] = useState(
    storage.getAuthUser()?.role === 'faculty' ? 'faculty-home' : 'home'
  );

  // App Layout & Theme
  const [theme, setThemeState] = useState(storage.getTheme());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data States
  const [classes, setClasses] = useState(storage.getClasses());
  const [attendance, setAttendance] = useState(storage.getAttendance());
  const [assignments, setAssignments] = useState(storage.getAssignments());
  const [notes, setNotes] = useState(storage.getNotes());
  const [cgpaData, setCgpaData] = useState(storage.getCgpaData());
  const [vaultResources, setVaultResources] = useState(storage.getVaultResources());
  const [bookmarks, setBookmarks] = useState(storage.getBookmarks());
  const [communityPosts, setCommunityPosts] = useState(storage.getCommunityPosts());
  const [leaves, setLeaves] = useState(storage.getLeaves());
  const [roster, setRoster] = useState(storage.getRoster());

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);
  const [uploadInitialSem, setUploadInitialSem] = useState(6);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Backend Health
  const [backendStatus, setBackendStatus] = useState({ online: false, database: false });

  const showToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync with Backend
  const syncWithBackend = useCallback(async () => {
    setLoadingClasses(true);
    try {
      const health = await checkBackendHealth();
      setBackendStatus(health);

      if (health.online) {
        try {
          const apiClasses = await fetchClasses();
          if (Array.isArray(apiClasses) && apiClasses.length > 0) {
            setClasses(apiClasses);
            storage.saveClasses(apiClasses);
          }
        } catch (e) {}

        try {
          const apiRes = await fetchVaultResources();
          if (Array.isArray(apiRes) && apiRes.length > 0) {
            setVaultResources(apiRes);
            storage.saveVaultResources(apiRes);
          }
        } catch (e) {}

        try {
          const apiPosts = await fetchCommunityPosts();
          if (Array.isArray(apiPosts) && apiPosts.length > 0) {
            setCommunityPosts(apiPosts);
            storage.saveCommunityPosts(apiPosts);
          }
        } catch (e) {}

        try {
          const apiLeaves = await fetchLeaves();
          if (Array.isArray(apiLeaves) && apiLeaves.length > 0) {
            setLeaves(apiLeaves);
            storage.saveLeaves(apiLeaves);
          }
        } catch (e) {}
      }
    } catch (e) {
      setBackendStatus({ online: false, database: false });
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Auth Handlers
  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    storage.saveAuthUser(authenticatedUser);
    setActiveScreen(authenticatedUser.role === 'faculty' ? 'faculty-home' : 'home');
    showToast(`Welcome back, ${authenticatedUser.name}! (${authenticatedUser.role === 'faculty' ? 'Faculty Portal' : 'Student Portal'})`, 'success');
  };

  const handleLogout = () => {
    storage.logout();
    setUser(null);
    showToast('Logged out of portal session.', 'info');
  };

  // Academic Vault Handlers
  const handleToggleBookmark = (resourceId) => {
    let updated;
    if (bookmarks.includes(resourceId)) {
      updated = bookmarks.filter((id) => id !== resourceId);
      showToast('Removed from saved items', 'info');
    } else {
      updated = [...bookmarks, resourceId];
      showToast('Saved to your bookmarks!', 'success');
    }
    setBookmarks(updated);
    storage.saveBookmarks(updated);
  };

  const handleUploadVaultResource = async (resourceData) => {
    if (user?.role !== 'faculty') {
      showToast('Unauthorized: Only faculty can publish to Academic Vault.', 'error');
      return;
    }
    let saved = { ...resourceData, _id: `res-${Date.now()}` };
    if (backendStatus.online) {
      try {
        const res = await createVaultResource(resourceData);
        saved = res;
      } catch (err) {
        console.warn('Backend upload fallback:', err.message);
      }
    }
    const updated = [saved, ...vaultResources];
    setVaultResources(updated);
    storage.saveVaultResources(updated);
    showToast('Resource uploaded to Academic Vault!', 'success');
  };

  // Community Forum Handlers
  const handleCreatePost = async (postData) => {
    let saved = {
      ...postData,
      _id: `post-${Date.now()}`,
      likesCount: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
    };
    if (backendStatus.online) {
      try {
        const res = await createCommunityPost(postData);
        saved = res;
      } catch (err) {
        console.warn('Backend forum fallback:', err.message);
      }
    }
    const updated = [saved, ...communityPosts];
    setCommunityPosts(updated);
    storage.saveCommunityPosts(updated);
    showToast('Topic published to Community Forum!', 'success');
  };

  const handleLikePost = async (postId) => {
    const userId = user?.id || user?.enrollmentNo || user?.facultyId || 'U-01';
    const updated = communityPosts.map((p) => {
      if (p._id === postId) {
        const liked = p.likedBy?.includes(userId);
        const newLikedBy = liked
          ? p.likedBy.filter((id) => id !== userId)
          : [...(p.likedBy || []), userId];
        const newCount = liked ? Math.max(0, (p.likesCount || 1) - 1) : (p.likesCount || 0) + 1;
        return { ...p, likedBy: newLikedBy, likesCount: newCount };
      }
      return p;
    });
    setCommunityPosts(updated);
    storage.saveCommunityPosts(updated);

    if (backendStatus.online) {
      try {
        await likeCommunityPost(postId, userId);
      } catch (e) {}
    }
  };

  const handleReplyPost = async (postId, replyData) => {
    const updated = communityPosts.map((p) => {
      if (p._id === postId) {
        const newReply = {
          ...replyData,
          createdAt: new Date().toISOString(),
        };
        return { ...p, replies: [...(p.replies || []), newReply] };
      }
      return p;
    });
    setCommunityPosts(updated);
    storage.saveCommunityPosts(updated);
    showToast('Reply added to discussion!', 'success');

    if (backendStatus.online) {
      try {
        await replyCommunityPost(postId, replyData);
      } catch (e) {}
    }
  };

  // Leaves Handlers
  const handleSubmitLeave = async (leaveData) => {
    let saved = {
      ...leaveData,
      _id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (backendStatus.online) {
      try {
        const res = await submitLeaveRequest(leaveData);
        saved = res;
      } catch (e) {}
    }
    const updated = [saved, ...leaves];
    setLeaves(updated);
    storage.saveLeaves(updated);
  };

  const handleUpdateLeaveStatus = async (leaveId, statusData) => {
    if (user?.role !== 'faculty') {
      showToast('Unauthorized: Only faculty can approve or reject leaves.', 'error');
      return;
    }
    const updated = leaves.map((l) => (l._id === leaveId ? { ...l, ...statusData } : l));
    setLeaves(updated);
    storage.saveLeaves(updated);

    if (backendStatus.online) {
      try {
        await updateLeaveStatus(leaveId, statusData);
      } catch (e) {}
    }
  };

  // Faculty Attendance Handler
  const handleSaveAttendanceRoster = async (attendanceData) => {
    if (user?.role !== 'faculty') {
      showToast('Unauthorized: Only faculty can submit attendance roster.', 'error');
      return;
    }
    setRoster(attendanceData.records);
    storage.saveRoster(attendanceData.records);

    if (backendStatus.online) {
      try {
        await saveFacultyAttendance(attendanceData);
      } catch (e) {}
    }
  };

  // Class Management Handlers
  const handleSaveClass = async (classData) => {
    let saved = { ...classData, _id: `local-${Date.now()}` };
    if (backendStatus.online) {
      try {
        saved = await createClass(classData);
      } catch (e) {}
    }
    const updated = [...classes, saved];
    setClasses(updated);
    storage.saveClasses(updated);
    showToast('Class scheduled successfully!', 'success');
  };

  const handleDeleteClass = async (id) => {
    if (backendStatus.online && !String(id).startsWith('local-') && !String(id).startsWith('seed-')) {
      try {
        await deleteClass(id);
      } catch (e) {}
    }
    const updated = classes.filter((c) => (c._id || c.id || c.code) !== id);
    setClasses(updated);
    storage.saveClasses(updated);
    showToast('Class slot removed', 'info');
  };

  // If not logged in, show Strict Login Screen
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isFaculty = user?.role === 'faculty';
  const pendingAssignmentsCount = assignments.filter((a) => a.status !== 'completed').length;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;

  // Strict Role Guard Sets
  const FACULTY_ONLY_SCREENS = ['faculty-home', 'mark-attendance', 'upload-resource', 'approve-leaves', 'faculty-timetable'];
  const STUDENT_ONLY_SCREENS = ['home', 'attendance', 'timetable', 'assistant', 'assignments', 'notes', 'cgpa'];

  // Check if current user is trying to access unauthorized views
  const isUnauthorizedFacultyAccess = !isFaculty && FACULTY_ONLY_SCREENS.includes(activeScreen);
  const isUnauthorizedStudentAccess = isFaculty && STUDENT_ONLY_SCREENS.includes(activeScreen);

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
        pendingAssignmentsCount={pendingAssignmentsCount}
        pendingLeavesCount={pendingLeavesCount}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          backendStatus={backendStatus}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotification={() => {
            showToast(
              isFaculty
                ? `You have ${pendingLeavesCount} pending leave requests to review.`
                : `You have ${pendingAssignmentsCount} pending deadlines and ${vaultResources.length} vault resources.`,
              'info'
            );
          }}
          onLogout={handleLogout}
          unreadCount={isFaculty ? pendingLeavesCount : pendingAssignmentsCount}
        />

        {/* Main Content Area with Strict Route Guards */}
        <main className="content-container">
          {/* Strict Security Guard: Block unauthorized faculty access */}
          {isUnauthorizedFacultyAccess && (
            <AccessDeniedView
              requiredRole="Faculty"
              onGoBack={() => setActiveScreen('home')}
              onLogout={handleLogout}
            />
          )}

          {/* Strict Security Guard: Redirect faculty to faculty home if accessing student dashboard */}
          {isUnauthorizedStudentAccess && (
            <AccessDeniedView
              requiredRole="Student"
              onGoBack={() => setActiveScreen('faculty-home')}
              onLogout={handleLogout}
            />
          )}

          {/* ================= Student Views (Only if logged in as Student) ================= */}
          {!isFaculty && (
            <>
              {activeScreen === 'home' && (
                <HomeView
                  profile={user}
                  classes={classes}
                  attendance={attendance}
                  assignments={assignments}
                  notes={notes}
                  onNavigate={setActiveScreen}
                  onOpenAddClass={() => setIsAddClassOpen(true)}
                  onOpenAddAssignment={() => setIsAddAssignmentOpen(true)}
                  onAskAiPrompt={(prompt) => {
                    setAiInitialQuery(prompt);
                    setActiveScreen('assistant');
                  }}
                />
              )}

              {activeScreen === 'attendance' && (
                <AttendanceView
                  attendance={attendance}
                  onUpdateAttendance={(up) => {
                    setAttendance(up);
                    storage.saveAttendance(up);
                  }}
                  profile={user}
                  onUpdateTarget={(t) => {
                    const up = { ...user, targetAttendance: t };
                    setUser(up);
                    storage.saveProfile(up);
                  }}
                />
              )}

              {activeScreen === 'timetable' && (
                <TimetableView
                  classes={classes}
                  onOpenAddClass={() => setIsAddClassOpen(true)}
                  onDeleteClass={handleDeleteClass}
                  onRefresh={syncWithBackend}
                  loading={loadingClasses}
                />
              )}

              {activeScreen === 'assistant' && (
                <AssistantView
                  initialQuery={aiInitialQuery}
                  onToast={showToast}
                  onSubmitLeave={handleSubmitLeave}
                  user={user}
                />
              )}

              {activeScreen === 'assignments' && (
                <AssignmentsView
                  assignments={assignments}
                  onOpenAddAssignment={() => setIsAddAssignmentOpen(true)}
                  onUpdateAssignments={(up) => {
                    setAssignments(up);
                    storage.saveAssignments(up);
                  }}
                />
              )}

              {activeScreen === 'notes' && (
                <NotesView
                  notes={notes}
                  onOpenAddNote={() => setIsAddNoteOpen(true)}
                  onUpdateNotes={(up) => {
                    setNotes(up);
                    storage.saveNotes(up);
                  }}
                  onToast={showToast}
                />
              )}

              {activeScreen === 'cgpa' && (
                <CgpaView
                  cgpaData={cgpaData}
                  onUpdateCgpa={(up) => {
                    setCgpaData(up);
                    storage.saveCgpaData(up);
                  }}
                  onToast={showToast}
                />
              )}
            </>
          )}

          {/* ================= Faculty Views (Only if logged in as Faculty) ================= */}
          {isFaculty && (
            <>
              {activeScreen === 'faculty-home' && (
                <FacultyHomeView
                  user={user}
                  classes={classes}
                  leaves={leaves}
                  resources={vaultResources}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'mark-attendance' && (
                <MarkAttendanceView
                  roster={roster}
                  onSaveAttendance={handleSaveAttendanceRoster}
                  user={user}
                  onToast={showToast}
                />
              )}

              {activeScreen === 'upload-resource' && (
                <UploadResourceView
                  initialSemester={uploadInitialSem}
                  onUploadResource={handleUploadVaultResource}
                  user={user}
                  onToast={showToast}
                />
              )}

              {activeScreen === 'approve-leaves' && (
                <ApproveLeavesView
                  leaves={leaves}
                  onUpdateLeaveStatus={handleUpdateLeaveStatus}
                  user={user}
                  onToast={showToast}
                />
              )}

              {activeScreen === 'faculty-timetable' && (
                <FacultyTimetableView
                  classes={classes}
                  onOpenAddClass={() => setIsAddClassOpen(true)}
                  onDeleteClass={handleDeleteClass}
                />
              )}
            </>
          )}

          {/* ================= Shared Views (Academic Vault, Community Forum, Settings) ================= */}
          {activeScreen === 'vault' && (
            <SemesterVaultView
              resources={vaultResources}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onOpenPreview={(res) => setPreviewResource(res)}
              onOpenUpload={(sem) => {
                if (isFaculty) {
                  setUploadInitialSem(sem);
                  setActiveScreen('upload-resource');
                } else {
                  showToast('Only faculty can upload resources to Academic Vault.', 'info');
                }
              }}
              user={user}
            />
          )}

          {activeScreen === 'community' && (
            <CommunityChatView
              posts={communityPosts}
              user={user}
              onLikePost={handleLikePost}
              onReplyPost={handleReplyPost}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
            />
          )}

          {activeScreen === 'profile' && (
            <ProfileView
              profile={user}
              onUpdateProfile={(up) => {
                setUser(up);
                if (isFaculty) storage.saveFacultyProfile(up);
                else storage.saveProfile(up);
                storage.saveAuthUser(up);
              }}
              theme={theme}
              toggleTheme={toggleTheme}
              backendStatus={backendStatus}
              onRefreshBackend={syncWithBackend}
              onToast={showToast}
            />
          )}
        </main>

        {/* Mobile Floating Bottom Bar */}
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} user={user} />
      </div>

      {/* Floating Alerts & Modals */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        classes={classes}
        notes={notes}
        assignments={assignments}
        onNavigate={(screen) => setActiveScreen(screen)}
        onAskAi={(prompt) => {
          setAiInitialQuery(prompt);
          setActiveScreen('assistant');
        }}
      />

      <ResourcePreviewModal
        resource={previewResource}
        isOpen={Boolean(previewResource)}
        onClose={() => setPreviewResource(null)}
        isBookmarked={previewResource ? bookmarks.includes(previewResource._id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToast={showToast}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSave={handleCreatePost}
        user={user}
      />

      <AddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onSave={handleSaveClass}
      />

      <AddAssignmentModal
        isOpen={isAddAssignmentOpen}
        onClose={() => setIsAddAssignmentOpen(false)}
        onSave={(data) => {
          const up = [{ ...data, id: `asg-${Date.now()}` }, ...assignments];
          setAssignments(up);
          storage.saveAssignments(up);
          showToast('Assignment added!', 'success');
        }}
      />

      <AddNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onSave={(data) => {
          const up = [{ ...data, id: `note-${Date.now()}` }, ...notes];
          setNotes(up);
          storage.saveNotes(up);
          showToast('Study note saved!', 'success');
        }}
      />
    </div>
  );
}
