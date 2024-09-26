// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >= 0.4.25 < 0.9.0;

contract Shipping {
    enum ShippingStatus {
        Pending,
        Shipped,
        Delivered
    }
    ShippingStatus private status;
    event LogNewAlert(string description);
    constructor() {
        status = ShippingStatus.Pending;
    }

    function Shipped()  public {
        status =  ShippingStatus.Shipped;
        emit LogNewAlert("Your package has been shipped");
    }

    function Delivered() public {
        status = ShippingStatus.Delivered;
        emit LogNewAlert("Your package has arrived");
    }

    function getStatus(ShippingStatus _status) internal pure returns(string memory s) {
        if (ShippingStatus.Pending == _status) return "Pending";
        if (ShippingStatus.Delivered == _status) return "Delivered";
        if (ShippingStatus.Shipped == _status) return "Shipped";
    }

    function Status() public view returns(string memory) {
        ShippingStatus _status = status;
        return getStatus(_status);
    }

}