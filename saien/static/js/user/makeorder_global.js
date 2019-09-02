/*
 * :: global variable section ::
 */
var products = products.productNames;
var unitDict = {
    "pc" : "Piece",
    "kg" : "Kilogram",
    "box" : "Box/Bag/Tray"};

// Global array storing names of already selected items.
// This acts as a barrier for user to select the same item
// twice.
var selectedItems = [];
