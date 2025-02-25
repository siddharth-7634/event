// Store tasks in local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    // Check if all fields are filled
    if (!taskInput.value || !dateInput.value || !timeInput.value) {
        document.getElementById('error-message').style.display = 'flex';
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        date: dateInput.value,
        time: timeInput.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();

    // Clear input fields
    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
}

// Function to display tasks
function displayTasks() {
    const dueTasksList = document.getElementById('dueTasksList');
    const upcomingTasksList = document.getElementById('upcomingTasksList');
    
    // Clear current lists
    dueTasksList.innerHTML = '';
    upcomingTasksList.innerHTML = '';

    // Group tasks by date
    const tasksByDate = groupTasksByDate();
    const currentDate = new Date().toISOString().split('T')[0];

    // Display tasks
    Object.entries(tasksByDate).forEach(([date, dateTasks]) => {
        const taskGroup = createTaskGroup(date, dateTasks);
        
        if (date <= currentDate) {
            dueTasksList.appendChild(taskGroup);
        } else {
            upcomingTasksList.appendChild(taskGroup);
        }
    });
}

// Function to group tasks by date
function groupTasksByDate() {
    const grouped = {};
    tasks.forEach(task => {
        if (!grouped[task.date]) {
            grouped[task.date] = [];
        }
        grouped[task.date].push(task);
    });
    return grouped;
}

// Function to create task group element
function createTaskGroup(date, tasks) {
    const group = document.createElement('div');
    group.className = 'task-group';

    const dateHeader = document.createElement('h3');
    dateHeader.className = 'task-date';
    dateHeader.textContent = formatDate(date);
    group.appendChild(dateHeader);

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        group.appendChild(taskElement);
    });

    return group;
}

// Function to create task element
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    
    const taskText = document.createElement('span');
    taskText.textContent = `${task.text} at ${formatTime(task.time)}`;
    
    const buttonsDiv = document.createElement('div');
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(task.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);
    
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(buttonsDiv);
    
    return taskDiv;
}

// Function to edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null) {
        task.text = newText;
        saveTasks();
        displayTasks();
    }
}

// Function to delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

// Function to search tasks
function searchTasks() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchText)
    );
    
    displayFilteredTasks(filteredTasks);
}

// Function to close error message
function closeError() {
    document.getElementById('error-message').style.display = 'none';
}

// Helper function to format date
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Helper function to format time
function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Initial display of tasks
document.addEventListener('DOMContentLoaded', displayTasks);
