import React from 'react';

const B2CProfiles = () => {
  const b2cCustomers = [
    { id: 1, name: 'Priya B2C', email: 'priya@example.com' },
    { id: 2, name: 'Amit B2C', email: 'amit@example.com' }
  ];

  return (
    <div>
      <h2>B2C Customer Profiles</h2>
      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {b2cCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default B2CProfiles;
