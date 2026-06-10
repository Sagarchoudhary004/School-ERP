import React, { useState } from 'react'

import AcademicYears from './AcademicYears'
import AcademicCalendar from './AcademicCalendar'
import ClassSections from './ClassSections'
import Departments from './Departments'
import Designations from './Designations'
import Subjects from './Subjects'
import ExamTypes from './ExamTypes'
import Categories from './Categories'

export default function Masters() {

  const tabs = [
    "Academic Years",
    "Exam Types",
    "Class & Sections",
    "Subjects",
    "Departments",
    "Designations",
    "Categories",
    "Academic Calendar",
  ];

  const [activeTab, setActiveTab] = useState("Academic Years");

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Master Setup
      </h1>

      <p className="text-gray-500 mt-2">
        Configure system masters and lookups
      </p>

      {/* Tabs */}

      <div className="flex gap-2 mt-6 bg-gray-100 p-2 rounded-xl">

        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all
            ${
              activeTab === tab
                ? "bg-white shadow font-semibold text-blue-900"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* Content */}

      <div className="mt-6">

        {activeTab === "Academic Years" &&
          <AcademicYears />
        }

        {activeTab === "Exam Types" &&
          <ExamTypes />
        }

        {activeTab === "Class & Sections" &&
          <ClassSections />
        }

        {activeTab === "Subjects" &&
          <Subjects />
        }

        {activeTab === "Departments" &&
          <Departments />
        }

        {activeTab === "Designations" &&
          <Designations />
        }

        {activeTab === "Categories" &&
          <Categories />
        }

        {activeTab === "Academic Calendar" &&
          <AcademicCalendar />
        }

      </div>

    </div>
  )
}