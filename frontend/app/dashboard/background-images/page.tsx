"use client";

import React from 'react';
import { Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';

export default function BackgroundImagesPage() {
  // Demo data - in a real app, this would come from an API
  const [images, setImages] = React.useState([
    { id: 1, name: 'Home Hero bg.jpg', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070', category: 'Homepage' },
    { id: 2, name: 'Courses Banner.png', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2070', category: 'Courses' },
    { id: 3, name: 'Contact Section.webp', url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2070', category: 'Contact' },
  ]);

  return (
    <div className="py-6">

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
            {/* Image Preview */}
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img 
                src={image.url} 
                alt={image.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-sm">
                {image.category}
              </span>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-slate-800 font-bold leading-tight group-hover:text-blue-600 transition-colors">
                    {image.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Uploaded on Oct 12, 2023</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 group hover:bg-white hover:border-blue-300 transition-all duration-300 cursor-pointer">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:text-blue-600 transition-all">
            <Plus className="w-8 h-8" />
          </div>
          <p className="font-bold text-slate-400 group-hover:text-blue-600">Add Image</p>
        </button>
      </div>
    </div>
  );
}
