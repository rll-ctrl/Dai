import { BigInt } from "@graphprotocol/graph-ts"
import {
  Dai,
  Approval,
  OwnershipTransferred,
  Transfer
} from "../generated/Dai/Dai"
import { 
  Approvals,
  Owner, 
  Transfers,
  Volume 
} from "../generated/schema"

export function handleApproval(event: Approval): void {
  let entity = Approvals.load(event.transaction.from.toHex())

  if (entity == null) {
    entity = new Approvals(event.transaction.from.toHex())
    entity.count = BigInt.fromI32(0)
  }

  entity.count = entity.count + BigInt.fromI32(1)
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.save()

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._decimals(...)
  // - contract._name(...)
  // - contract._symbol(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.burn(...)
  // - contract.decimals(...)
  // - contract.decreaseAllowance(...)
  // - contract.getOwner(...)
  // - contract.increaseAllowance(...)
  // - contract.mint(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let entity = Owner.load(event.transaction.from.toHex())
  entity.prevOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: Transfer): void {
  let entity1 = Transfers.load(event.transaction.from.toHex())

  if (entity1 == null) {
    entity1 = new Transfers(event.transaction.from.toHex())
    entity1.count = BigInt.fromI32(0)
  }

  entity1.count = entity1.count + BigInt.fromI32(1)
  entity1.from = event.params.from
  entity1.to = event.params.to
  entity1.value = event.params.value
  entity1.save()

  let entity2 = Volume.load(event.transaction.from.toHex());

  if (entity2 == null) {
    entity2 = new Volume(event.transaction.from.toHex())
    entity2.updateCounts = BigInt.fromI32(0)
    entity2.cumulativeVolume = BigInt.fromI32(0)
  }

  entity2.updateCounts = entity2.updateCounts + BigInt.fromI32(1)
  entity2.cumulativeVolume = entity2.cumulativeVolume + event.params.value

}
