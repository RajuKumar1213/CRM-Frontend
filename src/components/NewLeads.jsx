import React from "react";
import {format} from "date-fns"

function NewLeads({lead}) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {lead.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Contact: {lead.phone}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Product: {lead.product}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Assigned: {format(new Date(lead.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            lead.priority === 'high'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              : lead.priority === 'medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
          }`}
        >
          {lead.priority}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{lead.status}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-orange-500 h-1.5 rounded-full"
            style={{
              width: `${                lead.status === 'new'
                  ? 10
                  : lead.status === 'contacted'
                  ? 25
                  : lead.status === 'qualified'
                  ? 40
                  : lead.status === 'negotiating'
                  ? 55
                  : lead.status === 'in-progress'
                  ? 70
                  : lead.status === 'proposal-sent'
                  ? 85
                  : lead.status === 'won'
                  ? 100
                  : lead.status === 'lost'
                  ? 0
                  : lead.status === 'on-hold'
                  ? 50
                  : 10
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default NewLeads;
