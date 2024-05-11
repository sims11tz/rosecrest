import { useEffect, useState } from 'react';
import TransactionsController from 'controllers/TransactionsController';
import { TransactionObj } from '@shared/DataTypes';
import { NETWORK_COMMANDS } from '@shared/SharedNetworking';

import './overviewComponent.css';

function OverviewComponent()
{
	useEffect(() => {

		window.addEventListener(NETWORK_COMMANDS.TRANSACTIONS_FETCH_ALL.toString(), transactionsUpdated);
		return () => {
			window.removeEventListener(NETWORK_COMMANDS.TRANSACTIONS_FETCH_ALL.toString(), transactionsUpdated);
		};

	},[]);

	const [daterange, setDaterange] = useState("");
	const [transNum, setTransNum] = useState<string>("");
	const [transSum, setTransSum] = useState<string>("");

	const [transactions, setTransactions] = useState<TransactionObj[]>();
	const transactionsUpdated = (event: Event) => {
		const customEvent = event as CustomEvent<TransactionObj[]>;

		if(TransactionsController.get().Transactions.arr.length > 0)
		{
			let num:number=0;
			let sum:number=0;
			TransactionsController.get().Transactions.arr.forEach(TransactionObj => {
				num++;
				let cash = parseFloat(TransactionObj.amount.toString());
				if(cash>0) sum+=cash;
			});

			let formatterNum = new Intl.NumberFormat('en-US', {style: 'decimal',maximumFractionDigits:0});
			setTransNum(formatterNum.format(num));

			let formatterSum = new Intl.NumberFormat('en-US', {style: 'decimal',maximumFractionDigits: 2});
			setTransSum("$"+formatterSum.format(sum));
		}

		setTransactions(customEvent.detail);
	};

	return (
		<div className='overviewContainer'>
			<div className='overviewPod'>
				<span className='overviewPodLabel'>Date Range :</span>
				<span className='overviewPodValue'>{daterange}</span>
			</div>
			<div className='overviewPod'>
				<span className='overviewPodLabel'># Trans :</span>
				<span className='overviewPodValue'>{transNum}</span>
			</div>
			<div className='overviewPod'>
				<span className='overviewPodLabel'>Trans Total :</span>
				<span className='overviewPodValue'>{transSum}</span>
			</div>
		</div>
	)
}

export default OverviewComponent;