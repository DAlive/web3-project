const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Todo connect", function() {
    let Todo, todo;
    beforeEach(async function() {
        //获取合约工厂和部署合约
        Todo = await ethers.getContractFactory("Demo");
        todo = await Todo.deploy();
    });

        it("should create a task", async function() {
            await todo.Create("Task 1");
            const task = await todo.list(0);
            expect(task.name).to.equal("Task 1");
            expect(task.isCompleted).to.equal(false);
        });

        it("should modify task name using modiName1", async function() {
            await todo.Create("Task 1");
            await todo.modiName1(0, "Updated Task");
            const task = await todo.list(0);
            expect(task.name).to.equal("Updated Task");
        });

        it("should midify taks name using modiName2", async function() {
            await todo.Create("Task 1");
            await todo.modiName2(0, "Updated Task");
            const task = await todo.list(0);
            expect(task.name).to.equal("Updated Task");
        });

        it("should modify task status using midiStatus1", async function() {
            await todo.Create("Task 1");
            await todo.modiStatus1(0, true);
            const task = await todo.list(0);
            expect(task.isCompleted).to.equal(true);
        });

        it("should toggle task status using midiStatus2", async function() {
            await todo.Create("Task 1");
            await todo.modiStatus2(0);
            let task = await todo.list(0);
            expect(task.isCompleted).to.equal(true);
            await todo.modiStatus2(0);
            task = await todo.list(0);
            expect(task.isCompleted).to.equal(false);
        });

        it("should get task details using get1", async function () {
            await todo.Create("Task 1");
            const [name, status] = await todo.get1(0);
            expect(name).to.equal("Task 1");
            expect(status).to.equal(false);
          });
        
          it("should get task details using get2", async function () {
            await todo.Create("Task 1");
            const [name, status] = await todo.get2(0);
            expect(name).to.equal("Task 1");
            expect(status).to.be.false;
          });

})