import { expect, test } from 'vitest'
import { accounts } from '../../../../test/src/constants.js'
import { testClient, walletClient } from '../../../../test/src/utils.js'
import { getTransactionReceipt, mine } from '../../../actions/index.js'
import { optimism } from '../chains.js'
import { finalizeWithdrawal } from './finalizeWithdrawal.js'

const withdrawal = {
  nonce:
    1766847064778384329583297500742918515827483896875618958121606201292631377n,
  sender: '0x4200000000000000000000000000000000000007',
  target: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
  value: 88196830953025947900n,
  gasLimit: 287624n,
  data: '0xd764ad0b0001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000001000000000000000000000000099c9fc46f92e8a1c0dec1b1747d010903e884be1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a41635f5fd000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000000000000000000000000004c7fa16770649c8fc0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  withdrawalHash:
    '0x539dfd84b3939c6d2f61e1fbaa176a70e6a433e222093c3fea872ac36527d6ac',
} as const

test('default', async () => {
  const hash = await finalizeWithdrawal(walletClient, {
    account: accounts[0].address,
    targetChain: optimism,
    withdrawal,
  })
  expect(hash).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const receipt = await getTransactionReceipt(walletClient, {
    hash,
  })
  expect(receipt.status).toEqual('success')
})

test('args: chain (nullish)', async () => {
  const hash = await finalizeWithdrawal(walletClient, {
    account: accounts[0].address,
    chain: null,
    targetChain: optimism,
    withdrawal,
    gas: 420_000n,
  })
  expect(hash).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const receipt = await getTransactionReceipt(walletClient, {
    hash,
  })
  expect(receipt.status).toEqual('success')
})

test('args: gas', async () => {
  const hash = await finalizeWithdrawal(walletClient, {
    account: accounts[0].address,
    targetChain: optimism,
    withdrawal,
    gas: 420_000n,
  })
  expect(hash).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const receipt = await getTransactionReceipt(walletClient, {
    hash,
  })
  expect(receipt.status).toEqual('success')
})

test('args: gas (nullish)', async () => {
  const hash = await finalizeWithdrawal(walletClient, {
    account: accounts[0].address,
    targetChain: optimism,
    withdrawal,
    gas: null,
  })
  expect(hash).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const receipt = await getTransactionReceipt(walletClient, {
    hash,
  })
  expect(receipt.status).toEqual('success')
})

test('args: portal address', async () => {
  const hash = await finalizeWithdrawal(walletClient, {
    account: accounts[0].address,
    withdrawal,
    gas: 420_000n,
    portalAddress: optimism.contracts.portal[1].address,
  })
  expect(hash).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const receipt = await getTransactionReceipt(walletClient, {
    hash,
  })
  expect(receipt.status).toEqual('success')
})

test('error: small gas', async () => {
  await expect(() =>
    finalizeWithdrawal(walletClient, {
      account: accounts[0].address,
      targetChain: optimism,
      withdrawal,
      gas: 69n,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ContractFunctionExecutionError: Transaction creation failed.

    URL: http://localhost
    Request body: {"method":"eth_estimateGas","params":[{"from":"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266","data":"0x8c3152e900000000000000000000000000000000000000000000000000000000000000200001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000000700000000000000000000000025ace71c97b33cc4729cf772ae268934f7ab5fa1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000004638800000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001a4d764ad0b0001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000001000000000000000000000000099c9fc46f92e8a1c0dec1b1747d010903e884be1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a41635f5fd000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","gas":"0x45","to":"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"}]}
     
    Estimate Gas Arguments:
      from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      to:    0xbEb5Fc579115071764c7423A4f12eDde41f106Ed
      data:  0x8c3152e900000000000000000000000000000000000000000000000000000000000000200001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000000700000000000000000000000025ace71c97b33cc4729cf772ae268934f7ab5fa1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000004638800000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001a4d764ad0b0001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000001000000000000000000000000099c9fc46f92e8a1c0dec1b1747d010903e884be1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a41635f5fd000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
      gas:   69
     
    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data))
      args:                                   ({"nonce":"1766847064778384329583297500742918515827483896875618958121606201292631377","sender":"0x4200000000000000000000000000000000000007","target":"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1","value":"88196830953025947900","gasLimit":"287624","data":"0xd764ad0b0001000000000000000000000000000000000000000000000000000000002d51000000000000000000000000420000000000000000000000000000000000001000000000000000000000000099c9fc46f92e8a1c0dec1b1747d010903e884be1000000000000000000000000000000000000000000000004c7fa16770649c8fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a41635f5fd000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000160d7aa81e6fc30210aeb915c3bb1f55bfa86b37000000000000000000000000000000000000000000000004c7fa16770649c8fc0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","withdrawalHash":"0x539dfd84b3939c6d2f61e1fbaa176a70e6a433e222093c3fea872ac36527d6ac"})
      sender:    0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

    Docs: https://viem.sh/docs/contract/estimateContractGas
    Details: Out of gas: gas required exceeds allowance: 0x0000000000000000000000000000000000000000000000000000000000000045_U256
    Version: viem@1.0.2]
  `)
})