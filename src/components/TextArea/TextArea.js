import React, {
	useState,
	useEffect,
	useRef,
} from "react";

const TextArea = (props) => {
	const textAreaRef = useRef(null);
	const [text, setText] = useState("");
	const [textAreaHeight, setTextAreaHeight] = useState("auto");
	const [parentHeight, setParentHeight] = useState("auto");

	useEffect(() => {
		setParentHeight(`${textAreaRef.current.scrollHeight}px`);
		setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
	}, [text]);

	const onChangeHandler = (event) => {
		setTextAreaHeight("auto");
		setParentHeight(`${textAreaRef.current.scrollHeight}px`);
		setText(event.target.value);

		if (props.onChange) {
			props.onChange(event);
		}
	};

	return (
		<div
			style={{
				minHeight: parentHeight,
			}}
		>
			<textarea
				{...props}
				ref={textAreaRef}
				rows={1}
				style={{
					height: textAreaHeight,
				}}
				value={props.value}
                className="form-control message-textarea"
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default TextArea;