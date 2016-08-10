'use strict';

describe('Main View', function () {
  var page;

  beforeEach(function () {
    browser.get('/');
    page = require('./main.po');
  });

  describe('on page load', function () {
    it('should include the "todos" header', function () {
      expect(page.h1El.getText()).toBe('todos');
    });

    it('should display all the todos in the list', function () {
      expect(page.todoEls.count()).toBe(2);
      expect(page.todoEls.get(0).getText()).toBe('Learn Some DevOps with Donal and Will');
      expect(page.todoEls.get(1).getText()).toBe('Go for Coffee');
    });
  });

  describe('working with todos', function () {
    beforeEach(function removeAllTodos(done){
      page.todoEls.count().then(function (count) {
        for (var i=0; i<count; i++) {
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
      var todoElToRemove;
      beforeEach(function () {
        page.newToDoInputEl.sendKeys('Learn another language');
        page.newToDoInputEl.sendKeys(protractor.Key.ENTER);
      });
      it('should remove the new todo', function (done) {

        todoElToRemove = page.todoEls.get(0);
        browser.actions().mouseMove(todoElToRemove).perform();
        todoElToRemove.element(by.css('.destroy')).click().then(function(){
          expect(page.todoEls.count()).toBe(0);
          done();
        });

      });
    });

    describe('on filtering todos', function () {
      it('should not filter any todos when filtering by "All"', function () {

      });

      it('should filter on not completed todos when filtering by "Active"', function () {

      });

      it('should filter on completed todos when filtering by "Completed"', function () {

      });
    });
  });


});
