import * as React from "react";
import AddTransaction from "../AddTransaction/AddTransaction";
import BankActivity from "../BankActivity/BankActivity";
import "./Home.css";
import axios from "axios";

export default function Home(props) {
	function filterTransactions(key) {
		var resp = [];
		if (props.transactions == null) return;
		props.transactions.forEach((item) => {
			console.log(item);
			if (item.description.toLowerCase().includes(key.toLowerCase())) {
				resp = [...resp, item];
			}
		});

		return resp;
	}

	function findError() {
		if (props.error == null) {
			return (
				<BankActivity
					transactions={
						props.filterInputValue == ""
							? props.transactions
							: filterTransactions(props.filterInputValue)
					}
				/>
			);
		} else {
			return <h2 className="error">Something went wrong :(</h2>;
		}
	}

	function handleOnSubmitNewTransaction(form) {
		props.setNewTransactionForm(form);
	}

	const URL = "http://localhost:3001";
	React.useEffect(() => {
		props.setIsLoading(true);
		let fullURL = URL + "/bank/transactions";
		axios
			.get(fullURL)
			.then((resp) => {
				props.setTransactions(resp.transactions);
				console.log("fetch completed");
			})
			.catch((err) => setError(1));

		fullURL = URL + "/bank/transfers";
		axios
			.get(fullURL)
			.then((resp) => {
				props.setTransfers(resp.transfers);
				console.log("fetch completed");
			})
			.catch((err) => setError(1));

		props.setIsLoading(false);
	}, []);

	return (
		<div className="home">
			<AddTransaction
				isCreating={props.isCreating}
				setIsCreating={props.setIsCreating}
				newTransactionForm={props.newTransactionForm}
				setNewTransactionForm={props.setNewTransactionForm}
				form={props.newTransactionForm}
				setForm={props.setNewTransactionForm}
				handleOnSubmit={handleOnSubmitNewTransaction}
			/>
			{props.isLoading ? <h1>Loading...</h1> : findError()}
		</div>
	);
}
