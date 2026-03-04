export default function DashboardPage(): JSX.Element {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Super Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold mt-2">120</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Students</p>
          <h2 className="text-3xl font-bold mt-2">80</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Pending Payments</p>
          <h2 className="text-3xl font-bold mt-2 text-red-500">15</h2>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          Recent Activity
        </h3>

        <ul className="space-y-3 text-gray-600">
          <li>✔ New student registered</li>
          <li>✔ Payment received</li>
          <li>✔ Associate account updated</li>
        </ul>
      </div>

    </div>
  );
}