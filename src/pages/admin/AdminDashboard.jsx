const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Global O'quv Markazi boshqaruv paneli</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-2xl font-bold text-primary-600 mb-2">150+</div>
          <div className="text-gray-600">Jami o'quvchilar</div>
        </div>
        
        <div className="card p-6">
          <div className="text-2xl font-bold text-green-600 mb-2">9</div>
          <div className="text-gray-600">Fanlar soni</div>
        </div>
        
        <div className="card p-6">
          <div className="text-2xl font-bold text-yellow-600 mb-2">45+</div>
          <div className="text-gray-600">Yutuqlar</div>
        </div>
        
        <div className="card p-6">
          <div className="text-2xl font-bold text-red-600 mb-2">120+</div>
          <div className="text-gray-600">Bitiruvchilar</div>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tezkor havolalar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/subjects" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Fanlarni boshqarish</div>
            <div className="text-sm text-gray-600">Fanlar va guruhlarni qo'shish, tahrirlash</div>
          </a>
          
          <a href="/admin/achievements" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Yutuqlarni boshqarish</div>
            <div className="text-sm text-gray-600">Yutuqlarni qo'shish va nashr qilish</div>
          </a>
          
          <a href="/admin/graduates" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Talabalarni boshqarish</div>
            <div className="text-sm text-gray-600">Bitiruvchilar ma'lumotlarini boshqarish</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;