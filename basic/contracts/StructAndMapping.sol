// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract StructAndMapping {
    struct Book {
        uint isbn;
        string title;
        uint price;
    }

    //映射类型作为参数传入和返回时，函数可见性必须为private或internal
    mapping (uint => Book) public lib;

    function addBooksToMapping(Book[] memory books) public {
        for (uint i = 0; i < books.length; i++) {
            lib[books[i].isbn] = books[i];
        }
    }

    function StartAdd() public {
        Book[] memory books = new Book[](3);
        books[0] = Book(1, "Book 1", 10);
        books[1] = Book(2, "Book 2", 20);
        books[2] = Book(3, "Book 3", 30);

        addBooksToMapping(books);
    }

    function getBook(uint index) public view returns(uint, string memory, uint) {
        Book memory book = lib[index];
        return (book.isbn, book.title, book.price);
    }

    function getAllBooks() public view returns (Book[] memory) {
        uint count = 3;
        Book[] memory books = new Book[](count);
        for (uint i = 0; i < count; i++) {
            books[i] = lib[i + 1];
        }
        return books;
    }

}