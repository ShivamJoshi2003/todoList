const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox, index) => {
  checkbox.addEventListener("change", () => {
    const completed = checkbox.checked;
    fetch("/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: index, completed: completed }),
    })
      .then(() => {
        const listItem = checkbox.parentNode;
        if (completed) {
          listItem.classList.add("completed");
        } else {
          listItem.classList.remove("completed");
        }
      })
      .catch((error) => {
        console.error("Error updating completion status:", error);
      });
  });
});

async function handleCheckboxChange(checkbox) {
  const taskId = checkbox.getAttribute("data-task-id");
  const isChecked = checkbox.checked;

  try {
      await fetch(`/update/${taskId}?completed=${isChecked}`, { method: "POST" });

      // Update the tasks array in the frontend
      const taskIndex = tasks.findIndex(task => task._id === taskId);
      if (taskIndex !== -1) {
          tasks[taskIndex].completed = isChecked;
      }
  } catch (error) {
      console.error("Error updating task:", error);
  }
}


