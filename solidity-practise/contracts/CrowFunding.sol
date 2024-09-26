// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CrowFunding {
    address public immutable benificiary;   //受益人
    uint256 public immutable fundingGoal;   //筹资目标数量
    uint256 public fundingAmount;           //当前的金额
    mapping (address => uint256) public funders; 
    //可迭代的映射
    mapping(address => bool) private funderInserted;
    address[] public funderKey;
    //不使用自毁方法，使用变量来控制
    bool public AVAILABLED = true;      //状态
    //部署的时候，写入受益人+筹资目标数量
    constructor(address benificiary_, uint256 goal_) {
        benificiary = benificiary_;
        fundingGoal = goal_;
    }

    //资助
        //可用的时候才可以捐
        //合约关闭之后，就不能再操作了
    function contribute() external payable {
        require(AVAILABLED, "CrowFunding is closed");

        //检查捐赠金额是否会超过目标金额
        uint256 potentialFundingAmount = fundingAmount + msg.value;
        uint256 refundAmount = 0;

        if (potentialFundingAmount > fundingGoal) {
            refundAmount = potentialFundingAmount - fundingGoal;
            funders[msg.sender] += (msg.value - refundAmount);
            fundingAmount += (msg.value - refundAmount);
        } else {
            funders[msg.sender] += msg.value;
            fundingAmount += msg.value;
        }

        //更新捐赠者信息
        if(!funderInserted[msg.sender]) {
            funderInserted[msg.sender] = true;
            funderKey.push(msg.sender);
        }
    }

    function close() external returns(bool) {
        //1. 检查
        if (fundingAmount < fundingGoal) {
            return false;
        }

        uint256 amount = fundingAmount;
        //2. 修改
        fundingAmount = 0;
        AVAILABLED = false;
        //3. 操作
        payable(benificiary).transfer(amount);
        return true;
    }

    function fundersLength() public view returns(uint256) {
        return funderKey.length;
    }

}