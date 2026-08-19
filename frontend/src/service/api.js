const API_BASE_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(fullName, email, password) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    let message = "Registration failed";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail
        .map((item) => item.msg)
        .join(", ");
    }

    throw new Error(message);
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function getMyProfile() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load profile");
  }

  return data;
}

export async function getMySkills() {
  const response = await fetch(`${API_BASE_URL}/skills/me`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load skills");
  }

  return data;
}

export async function getMyExchanges() {
  const response = await fetch(`${API_BASE_URL}/exchanges/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load exchanges");
  }

  return data;
}

export async function getMatches() {
  const response = await fetch(`${API_BASE_URL}/matches/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load matches");
  }

  return data;
}


export async function updateMyProfile(profileData) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update profile");
  }

  return data;
}


export async function addSkill(skillData) {
  const response = await fetch(`${API_BASE_URL}/skills/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(skillData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to add skill");
  }

  return data;
}


export async function updateSkill(userSkillId, skillData) {
  const response = await fetch(
    `${API_BASE_URL}/skills/${userSkillId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update skill");
  }

  return data;
}


export async function deleteSkill(userSkillId) {
  const response = await fetch(
    `${API_BASE_URL}/skills/${userSkillId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete skill");
  }

  return true;
}


export async function sendExchangeRequest(requestData) {
  const response = await fetch(`${API_BASE_URL}/exchange-requests/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to send exchange request");
  }

  return data;
}


export async function getReceivedExchangeRequests() {
  const response = await fetch(
    `${API_BASE_URL}/exchange-requests/received`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load received exchange requests"
    );
  }

  return data;
}

export async function getSentExchangeRequests() {
  const response = await fetch(
    `${API_BASE_URL}/exchange-requests/sent`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load sent exchange requests"
    );
  }

  return data;
}

export async function acceptExchangeRequest(requestId) {
  const response = await fetch(
    `${API_BASE_URL}/exchange-requests/${requestId}/accept`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to accept exchange request"
    );
  }

  return data;
}

export async function rejectExchangeRequest(requestId) {
  const response = await fetch(
    `${API_BASE_URL}/exchange-requests/${requestId}/reject`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to reject exchange request"
    );
  }

  return data;
}


export async function getExchangeSessions(exchangeId) {
  const response = await fetch(
    `${API_BASE_URL}/exchanges/${exchangeId}/sessions`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load exchange sessions"
    );
  }

  return data;
}


export async function createExchangeSession(
  exchangeId,
  sessionData
) {
  const response = await fetch(
    `${API_BASE_URL}/exchanges/${exchangeId}/sessions`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to schedule session"
    );
  }

  return data;
}


export async function completeSession(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/complete`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to complete session"
    );
  }

  return data;
}


export async function submitReview(exchangeId, reviewData) {
  const response = await fetch(
    `${API_BASE_URL}/exchanges/${exchangeId}/reviews`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to submit review"
    );
  }

  return data;
}


export async function getNotifications() {
  const response = await fetch(
    `${API_BASE_URL}/notifications/`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load notifications"
    );
  }

  return data;
}


export async function markNotificationRead(notificationId) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to mark notification as read"
    );
  }

  return data;
}


export async function getAdminDashboard() {
  const response = await fetch(
    `${API_BASE_URL}/admin/dashboard`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load admin dashboard"
    );
  }

  return data;
}


// ========================================
// ADMIN - GET ALL USERS
// ========================================

export async function getAdminUsers() {
  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load users"
    );
  }

  return data;
}


// ========================================
// ADMIN - UPDATE USER STATUS
// ========================================

export async function updateAdminUserStatus(
  userId,
  isActive
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        is_active: isActive,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update user status"
    );
  }

  return data;
}


export async function getAdminExchanges() {
  const response = await fetch(
    `${API_BASE_URL}/admin/exchanges`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load exchanges"
    );
  }

  return data;
}


export async function completeExchange(exchangeId) {
  const response = await fetch(
    `${API_BASE_URL}/exchanges/${exchangeId}/complete`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to complete exchange"
    );
  }

  return data;
}