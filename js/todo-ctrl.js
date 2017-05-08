app.controller("todo-ctrl", function($scope, $filter) {
        $scope.tasks = [];

        $scope.newToDo = function() {


            $scope.tasks = [{
                taskName: "Default Task",
                taskDesc: "This is the default task. Click the checkbox to mark this task as complete, or click the x to delete. Add tasks below.",
                taskComp: false
                },{
                taskName: "Complete Task",
                taskDesc: "Congrats! This task has been completed!",
                taskComp: true
            }];

            $scope.show = true;
        }

        $scope.addNewTask = function() {
            var task = {
                taskName: $scope.newTaskName,
                taskDesc: $scope.newTaskDesc,
                taskComp: false
            };

            console.log("creating new task");
            console.log(task);

            $scope.addTask(task, false, false);
            clear();

        }

        $scope.addTask = function(task, comp, apply) {
            if(task){
                $scope.tasks.push({
                    taskName: task.taskName,
                    taskDesc: task.taskDesc,
                    taskComp: comp
                });

                console.log($scope.tasks);

                $scope.tasks = $filter('unique')($scope.tasks);

                console.log($scope.tasks);
                $scope.show = true;
                if(apply) $scope.$apply();
            }
        }

        $scope.completeTask = function(task) {
            $scope.tasks = $service('completeTaskService')($scope.tasks, task);
        }

        $scope.deleteTask = function(task) {
            $scope.tasks.splice($scope.tasks.indexOf(task), 1);
        }

        function clear() {
            $scope.newTaskName = "";
            $scope.newTaskDesc = "";
        }
    })
    .directive("dropzone", function() {
        return {
            restrict: 'A',
            link: function($scope, elem, attrs, ctrl) {
                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();

                    var file = evt.dataTransfer.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function(theFile) {
                        var json = JSON.parse(theFile.target.result);

                        for (var i = 0; i < json.todo.length; i++) {
                            var name = json.todo[i].task;
                            var desc = json.todo[i].description;
                            var comp = json.todo[i].complete;
                            var task = {
                                taskName: name,
                                taskDesc: desc,
                                taskComp: comp
                            };
                            $scope.addTask(task, comp, true);
                        }
                    };
                    fileReader.readAsText(file);
                });

                elem.bind('dragover', function(evt) {
                    evt.preventDefault();
                });
            }
        }
    })
    .filter("unique", function(){
        return function(tasks){
            var newTasks = [];
            for(var i = 0; i < tasks.length; i++){
                var found = false
                for(var j = 0; j < newTasks.length; j++){
                    if(tasks[i].taskName == newTasks[j].taskName){
                        found = true;
                        alert("Please enter a task with a unique name.");
                        break;
                    }
                }
                if(!found) newTasks.push(tasks[i]);
            }
            return newTasks;
        }
    })
    .filter("taskCompletion", function(){
        return function(tasks, comp){
            var newTasks = [];
            for(var i = 0; i < tasks.length; i++){
                if(tasks[i].taskComp == comp){
                    newTasks.push(tasks[i]);
                }
            }
            return newTasks;
        }
    })
    .service("completeTaskService", function(){
        return function(tasks, task){
            var index = tasks.indexOf(task);
            var newTask = tasks[index];
            newTask.taskComp = true;
            tasks[i] = newTask;

            return tasks;
        }
    });
