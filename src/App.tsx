import "./App.css";
import { ComboBox } from "./components/combobox";

const options = [
	"Banana",
	"Cherry",
	"Date",
	"Elderberry",
	"Fig",
	"Apple",
	"Grape",
];

function App() {
	const handleSelect = (value: string) => {
		console.log(value);
	};
	return (
		<div className="p-10 max-w-md mx-auto">
			<ComboBox
				options={options}
				onSelect={handleSelect}
			/>
		</div>
	);
}

export default App;
