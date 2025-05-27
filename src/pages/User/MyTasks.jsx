import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstanc';
import { API_PATHS } from '../../utils/apiPaths';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      const tasks = response.data?.tasks || [];
      
      // Calculate status for each task and filter based on status
      const processedTasks = tasks.map(task => ({
        ...task,
        calculatedStatus: getTaskStatus(task.todoChecklist)
      }));

      // Filter tasks based on calculated status
      const filteredTasks = filterStatus === "All" 
        ? processedTasks 
        : processedTasks.filter(task => task.calculatedStatus === filterStatus);

      setAllTasks(filteredTasks);

      // Count tasks by calculated status for tabs
      const statusCounts = {
        all: processedTasks.length,
        pending: processedTasks.filter(task => task.calculatedStatus === "Pending").length,
        inProgress: processedTasks.filter(task => task.calculatedStatus === "In Progress").length,
        completed: processedTasks.filter(task => task.calculatedStatus === "Completed").length
      };

      const statusArray = [
        { label: "All", count: statusCounts.all },
        { label: "Pending", count: statusCounts.pending },
        { label: "In Progress", count: statusCounts.inProgress },
        { label: "Completed", count: statusCounts.completed }
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAllTasks([]);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }

  const getTaskStatus = (todoChecklist) => {
    if (!todoChecklist?.length) return "Pending";

    const totalTodos = todoChecklist.length;
    const completedTodos = todoChecklist.filter(todo => todo.completed).length;

    if (completedTodos === 0) return "Pending";
    if (completedTodos === totalTodos) return "Completed";
    return "In Progress";
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => { };
  }, [filterStatus])



  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-x md:text-xl font-medium">My Tasks</h2>
          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => {
            const totalTodos = item.todoChecklist?.length || 0;
            const completedTodos = item.todoChecklist?.filter(todo => todo.completed)?.length || 0;
            const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

            // Calculate status based on todos completion
            const calculatedStatus = getTaskStatus(item.todoChecklist);

            return (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={calculatedStatus} // Use calculated status instead of item.status
                progress={progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={completedTodos}
                todoCheckList={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTasks
