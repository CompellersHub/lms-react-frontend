import { useState } from 'react'
import React from 'react'
import img from "../assets/img.png"
import { FaHome, FaBook, FaQuestionCircle, FaPlayCircle, FaMale, FaCertificate } from 'react-icons/fa';

const Portal = () => {
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard' },
    { icon: <FaBook />, label: 'Course Library' },
    { icon: <FaQuestionCircle />, label: 'My Progress' },
    { icon: <FaPlayCircle />, label: 'Assessments' },
    { icon: <FaMale />, label: 'Discussion' },
    { icon: <FaCertificate />, label: 'Certificate' },
  ];

  const courses = [
    { title: "Business Analysis/Project Management", subtitle: "Resivcourse", progress: 30 },
    { title: "AML/KYC Compliance", subtitle: "On-demand", progress: 30 },
    { title: "Cyber Security", subtitle: "Resume course", progress: 30 },
    { title: "Data Analysis", subtitle: "Next module", progress: 29 }
  ];

  const [navOpen, setNavOpen] = useState(false);

  return (
    <section className="w-full h-auto bg-gray-300/20 flex justify-center pt-2">
      <div className='w-[90%] h-auto bg-transparent rounded-md'>
        <nav className="bg-blue-700 w-full h-[10vh] rounded-t-md text-white flex items-center justify-between px-8 pl-0 relative">
          <h3 className="bg-blue-900/30 text-center font-semibold rounded-tl-md py-5 px-8 text-white h-[10vh] w-[250px]">STUDENT PORTAL</h3>
          <ul className={`list-none flex gap-8 font-medium ${navOpen ? 'flex-col absolute top-[70px] left-0 right-0 bg-blue-700 p-4 z-[1000]' : 'hidden lg:flex'}`}>
            <li className="cursor-pointer hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300">My Courses</li>
            <li className="cursor-pointer hover:text-gray-300">Certificate</li>
            <li className="cursor-pointer hover:text-gray-300">Support</li>
          </ul>
          <img src={img} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          <button className="menu-toggle block lg:hidden bg-transparent border-none text-white text-2xl cursor-pointer" onClick={() => setNavOpen(!navOpen)}>☰</button>
        </nav>

        <div className='flex flex-col lg:flex-row w-full'>
          <div className="w-[250px] h-[165vh] bg-blue-900/80 p-5 shadow-md mb-12 flex-shrink-0 flex-col hidden lg:flex">
            {menuItems.map((item, index) => (
              <div className="flex items-center gap-4 p-3 mb-3 rounded-lg cursor-pointer hover:bg-indigo-100 hover:translate-x-1 transition" key={index}>
                <span className="text-white text-lg">{item.icon}</span>
                <h5 className="text-white font-medium text-base">{item.label}</h5>
              </div>
            ))}
          </div>

          <div className='w-full lg:w-[75%] h-auto bg-transparent pt-8 pl-8'>
            <h2 className="text-3xl font-bold m">Welcome Back</h2>
            <p className="text-lg">Continue your learning journey with one of your current Courses.</p>

            <div className="w-full max-w-[800px] mx-auto p-5 mt-5 font-segoe bg-white rounded-[1rem]">
              <h3 className="mb-5 text-[#222] font-bold text-xl">Current Courses</h3>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-5">
                {courses.map((course, index) => (
                  <div className="bg-[#f1f6ff] p-5 rounded-xl shadow-sm relative" key={index}>
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-1">{course.title}</h4>
                    <p className="text-sm text-[#555] mb-2">{course.subtitle}</p>
                    <div className="bg-blue-100 h-2 rounded-md overflow-hidden mb-2">
                      <div className="bg-blue-600 h-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="text-sm text-[#555] mb-2 block">{course.progress}%</span>
                    <button className="bg-blue-600 text-white border-none p-2 w-full rounded-md cursor-pointer font-semibold text-sm hover:bg-blue-900">Resume Course</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-5">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-lg mb-4 font-semibold">Upcoming Deadlines</h3>
                <div className="flex items-center mb-2">
                  <div className="bg-[#eef2f7] rounded-md px-2 py-1 mr-2 text-center min-w-[50px]">
                    <span className="text-xs text-[#555] block">Apr</span>
                    <span className="text-base font-bold">25</span>
                  </div>
                  <div className="text-sm">Project Plan Submission</div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="bg-[#eef2f7] rounded-md px-2 py-1 mr-2 text-center min-w-[50px]">
                    <span className="text-xs text-[#555] block">Apr</span>
                    <span className="text-base font-bold">28</span>
                  </div>
                  <div className="text-sm">Case Study Analysis</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-lg mb-4 font-semibold">Progress Overview</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                      <path className="fill-none stroke-[#eee] stroke-[3.8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="fill-none stroke-blue-500 stroke-[3.8] stroke-[round]" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold">60%</div>
                  </div>
                  <div className="text-sm">
                    <p>Enrolled: 60%</p>
                    <p>Completion: 2</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-lg mb-4 font-semibold">Upcoming Deadlines</h3>
                <div className="text-sm flex items-center gap-2">📄 Certificate</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-lg mb-4 font-semibold">Achievements & Certificates</h3>
                <div className="text-sm flex items-center gap-2">📜 Certificate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portal;
