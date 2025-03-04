import React from "react";


const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/logout", {
                method: "POST",
                credentials: "include",  // Ensure cookies (sessions) are sent
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Redirect to login or home page
                window.location.href = "/admin-login";
            } else {
                const errorData = await response.json();
                console.error("Error Data:", errorData); // Log detailed error information
                alert(errorData.message || "Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Logout error:", error);  // Log the full error
            alert("An error occurred while logging out.");
        }
    };

    return <button onClick={handleLogout} className="">Logout</button>;
};

export default LogoutButton;
