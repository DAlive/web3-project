// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MultiSigWallet {
    //状态变量
    //拥有者地址数组
    address[] public owners;
    //是否为owner
    mapping (address => bool) public isOwner;
    //需要多少人验证
    uint256 public required;
    //交易结构
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool exected;
    }
    //记录交易数组
    Transaction[] public transactions;
    //记录每笔交易是否被某个所有者批准
    mapping(uint256 => mapping(address => bool)) public approved;

    //事件
    //记录存款事件
    event Deposit(address indexed sender, uint256 amount);
    //记录提交交易事件
    event Submit(uint256 indexed txId);
    //记录批准交易事件
    event Approve(address indexed owner, uint256 indexed txId);
    //记录撤销批准事件
    event Revoke(address indexed owner, uint256 indexed txId);
    //记录交易执行事件
    event Execute(uint256 indexed txId);

    //receive
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    //函数修饰器
    //用来验证调用者是否为钱包的owner
    modifier onlyOwner {
        require(isOwner[msg.sender], "not owner");
        _;
    }
    //检查交易是否存在，超出范围抛出异常
    modifier txExists(uint256 _txId) {
        require(_txId < transactions.length, "tx doesn't exist");
        _;
    }
    //确保当前所有者尚未批准指定交易
    modifier notApproved(uint256 _txId) {
        require(!approved[_txId][msg.sender], "tx already approved");
        _;
    }
    //确保指定交易尚未运行
    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].exected, "tx is exected");
        _;
    }

    //构造函数
    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "owner required");
        require(_required > 0 && _required <= _owners.length, "invalid required number of owners");
        for (uint index = 0; index < _owners.length; index++) {
            address owner = _owners[index];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner is not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }
        required = _required;
    }

    //函数
    function getBalance()  external view returns (uint256) {
        return address(this).balance;
    }

    function submit(address _to, uint256 _value, bytes calldata _data) external onlyOwner returns(uint256) {
        transactions.push(Transaction({to: _to, value: _value, data: _data, exected: false}));
        emit Submit(transactions.length - 1);
        return transactions.length - 1;
    }

    function approv(uint256 _txId) 
    external 
    onlyOwner 
    txExists(_txId)
    notApproved(_txId)
    notExecuted(_txId) {
        approved[_txId][msg.sender] = true;
        emit Approve(msg.sender, _txId);
    }

    function execute(uint256 _txId) 
    external
    onlyOwner
    txExists(_txId)
    notExecuted(_txId) {
        require(getApprovalCount(_txId) >= required, "approvals < required");
        Transaction storage transaction = transactions[_txId];
        transaction.exected = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");
        emit Execute(_txId);
    }

    function getApprovalCount(uint256 _txId) public view returns (uint256 count){
        for (uint256 index = 0; index < owners.length; index++) {
            if (approved[_txId][owners[index]]) {
                count += 1;
            }
        }
    }

    function revoke(uint256 _txId) 
    external 
    onlyOwner
    txExists(_txId)
    notExecuted(_txId) {
        require(approved[_txId][msg.sender], "tx not approved");
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender, _txId);
    }
}