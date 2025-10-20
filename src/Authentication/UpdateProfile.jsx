import React, { useState } from "react";
import axios from "axios";
import UseAuth from "../hook/UseAuth";


const UpdateProfile = () => {
    const { user } = UseAuth();
    console.log(user);
    console.log(user._id);
    const [name, setName] = useState(user?.name || "");
    const [profilePic, setProfilePic] = useState(user?.profilePic || "");

    const handleUpdate = async (e) => {
        e.preventDefault();

       

        try {
            const res = await axios.put(`https://ph-assignment-12-server-eight.vercel.app/users/email/${user.email}`, {
                name,
                profilePic,
            });

            console.log("Update success:", res.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />
            <input
                type="text"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="Enter profile pic URL"
            />
            <button type="submit">Update</button>
        </form>
    );
};

export default UpdateProfile;
