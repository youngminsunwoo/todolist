'use strict';

var hasClass = function (element, cls) {
  return element.getAttribute('class').then(function (classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

describe('Main View', function () {
  var page;

  beforeEach(function () {
    browser.get('/');
    page = require('./todos.po');
  });

  describe('on page load', function () {
    it('should include the "todos" header', function () {
      expect(page.h1El.getText()).toBe('todos');
    });

    it('should display all the todos in the list', function () {
      expect(page.todoEls.count()).toBe(2);
      expect(page.todoEls.get(0).getText()).toBe('Learn some stuff about Jenkins');
      expect(page.todoEls.get(1).getText()).toBe('Go for Coffee');
    });
  });

  describe('todos: ', function () {
    beforeEach(function removeAllTodos(done) {
      page.todoEls.count().then(function (count) {
        for (var i = 0; i < count; i++) {
          // hover over the list element to get the destroy icon to appear
          browser.actions().mouseMove(page.todoEls.get(0)).perform();
          // angular removes the element each loop, hence using get(0) and not get(i)
          page.todoEls.get(0).element(by.css('.destroy')).click();
        }
      });
      done();
    });

    describe('on adding new todo',function(){
      it('should add the todo to the list', function () {
        page.newToDoInputEl.sendKeys('Enjoy the british weather');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
        expect(page.todoEls.get(0).getText()).toBe('Enjoy the british weather');
        expect(page.todoEls.count()).toBe(1);
      });
    });

    describe('on removing todo', function () {

      beforeEach(function () {
        page.newToDoInputEl.sendKeys('Learn another language');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
      });

      it('should remove the new todo', function (done) {
        var todoElToRemove = page.todoEls.get(0);
        browser.actions().mouseMove(todoElToRemove).perform(); // hover over the todos to make remove icon appear
        todoElToRemove.element(by.css('.destroy')).click().then(function(){
          expect(page.todoEls.count()).toBe(0);
          done();
        });

      });
    });

    describe('on toggling todo complete status',function(){
      var incompleteTodoEl, completeTodoEl;
      beforeEach(function(){
        page.newToDoInputEl.sendKeys('Attend a DevOps course');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
        completeTodoEl = page.todoEls.get(0);
        completeTodoEl.element(by.css('.toggle')).click(); // toggle already complete
        page.newToDoInputEl.sendKeys('Learn some protractor');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
        incompleteTodoEl = page.todoEls.get(1);
      });
      it('should add the class completed to todo when toggled from incomplete to complete',function(){
        // this expectation checks that the class attribute has a value that contains 'complete'
        expect(completeTodoEl.getAttribute('class')).toMatch('complete');
        completeTodoEl.element(by.css('.toggle')).click();
        expect(completeTodoEl.getAttribute('class')).not.toMatch('complete');
      });
      it('should remove the class completed when toggled from complete to incomplete',function(){
        expect(incompleteTodoEl.getAttribute('class')).not.toMatch('complete');
        incompleteTodoEl.element(by.css('.toggle')).click();
        expect(incompleteTodoEl.getAttribute('class')).toMatch('complete');
      });
    });

    describe('on filtering todos', function () {
      beforeEach(function(){
        page.newToDoInputEl.sendKeys('Buy a spaceship');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
        page.newToDoInputEl.sendKeys('Enjoy the DevOps course');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
        page.todoEls.get(1).element(by.css('.toggle')).click(); // toggle already complete
        page.newToDoInputEl.sendKeys('Tell friends and family about the course!');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
      });

      it('should filter on not completed todos when filtering by "Active"', function () {
        expect(page.todoEls.count()).toBe(3);
        page.todoActiveStatusFilterEl.click();
        expect(page.todoEls.count()).toBe(2);
      });

      it('should not filter any todos when filtering by "All"', function () {
        page.todoActiveStatusFilterEl.click();// default page load is all, navigate away to prove the test
        expect(page.todoEls.count()).toBe(2);
        page.todoAllStatusFilterEl.click();
        expect(page.todoEls.count()).toBe(3);
      });

      it('should filter on completed todos when filtering by "Completed"', function () {
        expect(page.todoEls.count()).toBe(3);
        page.todoCompletedStatusFilterEl.click();
        expect(page.todoEls.count()).toBe(1);
      });
    });
  });

});
