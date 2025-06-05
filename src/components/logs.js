import React, { useEffect, useState } from 'react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
  const token = localStorage.getItem('jwt');
  fetch('http://localhost:8000/api/v1/audit-logs/', {
    credentials: 'include',
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (Array.isArray(data.results)) {
        setLogs(data.results);
      } else {
        setLogs([]);
      }
    });
}, []);
  return (
    <div>
      <h2>Audit Log</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Model</th>
            <th>ID</th>
            <th>Action</th>
            <th>User</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.timestamp}</td>
              <td>{log.model_name}</td>
              <td>{log.object_id}</td>
              <td>{log.action}</td>
              <td>{log.user}</td>
              <td>
                <pre style={{maxWidth: 400, overflowX: 'auto'}}>
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}