
interface Name {
    name: string;
}

const CustomButton =  (props: Name) => {
    return (
        <>
            <style>
            {`
            .button {
                background-color: #1c1c1c;
                border-radius: 2px;
                border-style: dotted;
                border-width: 1px;
                border-color: #1c1c1c;
                color: #B7B7B7;
                cursor: pointer;
                display: inline-block;
                font-size: 1em;
                font-weight: normal !important;
                line-height: 1.2;
                margin: 0 3px 0 0;
                padding: 2px 7px;
                position: relative;
                text-align: center;
                text-decoration: none !important;
                text-overflow: ellipsis;
                text-shadow: none;
                white-space: nowrap;
            }
            .button:hover {
                color: white;
            }
            .menu {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px;
                flex-wrap: wrap;
            }
            `}
        </style>
        <button className="button">{props.name}</button>
        </>
    );
}

export default CustomButton;