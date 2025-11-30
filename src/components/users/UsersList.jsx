import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";
import LogoutButton from "../auth/LogoutButton";

export default function UsersList() {
 const [users, setUsers] = useState([]);

 useEffect(() => {
 loadUsers();
 }, []);

 const loadUsers = async () => {
 try {
 const res = await getAllUsers();
 setUsers(res.data.data);
 } catch (err) {
 console.log(err);
 }
 };


    return (
      <>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">📋 Users List</h2>
          <LogoutButton />
        </div>
  
        <div className="max-w-5xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-5 text-center">📋 Users List</h2>
  
          <table className="w-full border-collapse shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
  
            <tbody>
              {users.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50">
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.phone}</td>
                  <td className="border p-2">
                    {u.status === "active" ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
