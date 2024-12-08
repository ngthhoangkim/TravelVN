import React from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { HomeBar } from './HomeContent';


function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - full width */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>

      {/* Main content  */}
      <div className="flex mt-16">
        {/* Sidebar */}
        <div className="w-64 h-[calc(100vh-4rem)] fixed left-0">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="ml-64 flex-1 p-6">
          <HomeBar />
        </div>
      </div>
    </div>
  );
}

export default Home; 