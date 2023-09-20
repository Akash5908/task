import React, { useState, useEffect } from "react";

const address = [
  "0x2CB99F193549681e06C6770dDD5543812B4FaFE8=1",
  "0x8B3392483BA26D65E331dB86D4F430E9B3814E5e 50",
  "0xEb0D38c92deB969b689acA94D962A07515CC5204=2",
  "0xF4aDE8368DDd835B70b625CF7E3E1Bc5791D18C1=10",
  "0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB,13",
  "0x2CB99F193549681e06C6770dDD5543812B4FaFE8=1",
  "0x8B3392483BA26D65E331dB86D4F430E9B3814E5e 50",
  "0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB,13",
  "0x2CB99F193549681e06C6770dDD5543812B4FaFE8=1",
];

const Disperse = () => {
  const [inputValue, setInputValue] = useState(address);
  const [error, setError] = useState(null);
  const [showerror, setshowError] = useState(false);
  const [splitdata, setSplitData] = useState([]);
  const [showbutton, setShowbutton] = useState(false);

  useEffect(() => {
    const tempSplitData = inputValue.map((str, index) => {
      const [address, amount] = str.split(/[ ,=]/);
      return { address, amount: amount, line: index + 1 };
    });


    setSplitData(tempSplitData);
  }, [inputValue]);

  const onSumbit = () => {
    const errors = [];
    const duplicateMap = new Map();

    for (let previous = 0; previous < splitdata.length; previous++) {
      if (isNaN(splitdata[previous].amount)) {
        errors.push(`Line ${previous + 1} wrong amount`);
      }

      for (let current = previous + 1; current < splitdata.length; current++) {
        if (splitdata[previous].address === splitdata[current].address) {
          if (!duplicateMap.has(splitdata[previous].address)) {
            duplicateMap.set(splitdata[previous].address, [previous + 1]);
          }
          if (
            !duplicateMap.get(splitdata[previous].address).includes(current + 1)
          ) {
            duplicateMap.get(splitdata[previous].address).push(current + 1);
          }
        }
      }
    }
    duplicateMap.forEach((index, address) => {
      errors.push(
        `Address ${address} has duplicate entries at lines ${index.join(", ")}`
      );
      setShowbutton(true);
    });
    if (errors.length > 0) {
      setError(errors);
      setshowError(true);
    } else {
      setError([]);
      setShowbutton(false);
      setshowError(false);
    }
  };

  const handleCombineBalances = (index) => {
    const combinedData = [];
    let counter = 1

    for (let previous = 0; previous < splitdata.length; previous++) {
      for (let current = previous + 1; current < splitdata.length; current++) {
        if (splitdata[previous].address === splitdata[current].address) {
          const duplicateAmount = parseInt(splitdata[current].amount, 10); // Parse to integer
          splitdata[previous].amount = parseInt(splitdata[previous].amount, 10); // Parse to integer
          splitdata[previous].amount += duplicateAmount;
          // Remove the duplicate entry
          splitdata.splice(current, 1);
          current--; // Adjust the loop index since we removed an element
        }
      }
      // Push non-duplicate items to combinedData
      combinedData.push({
        address: splitdata[previous].address,
        amount: splitdata[previous].amount,
        line:counter++, // Include the line index
      });
    }
    setShowbutton(false);
    setSplitData(combinedData);
  };
  const KeepFirstOne = () => {
    const filteredData = [];
    let counter = 1
    for (let previous = 0; previous < splitdata.length; previous++) {
      for (let current = previous + 1; current < splitdata.length; current++) {
        if (splitdata[previous].address === splitdata[current].address) {
          // Remove the duplicate entry
          splitdata.splice(current, 1);
          current--; // Adjust the loop index since we removed an element
        }
      }
      // Push non-duplicate items to combinedData
      filteredData.push({
        address: splitdata[previous].address,
        amount: splitdata[previous].amount,
        line:counter++, // Include the line index
      });
    }
    setShowbutton(false);
    setSplitData(filteredData);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "whitesmoke",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "90%",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%", height: "50%", padding: "3vw" }}>
          <h4>Addresses with Amounts</h4>

          <textarea
            cols={5}
            style={{ width: "100%", height: "80%", display: "block" }}
            value={
              splitdata.length > 0
                ? splitdata
                    .map((item) => `${item.line}) ${item.address} ${item.amount}`)
                    .join("\n")
                : inputValue
            }
            onChange={(e) => setInputValue(e.target.value.split("\n"))}
          ></textarea>
          <span style={{ color: "#7D7C7C", fontSize: "13px" }}>
            Separated by ','or' 'or'='
          </span>
          {showbutton && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                color: "red",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "red",
                  border: "none",
                  marginRight: "5px",
                }}
                onClick={() => {
                  KeepFirstOne();
                  onSumbit();
                }}
              >
                Keep first one
              </button>
              |
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "red",
                  border: "none",
                  marginLeft: "5px",
                }}
                onClick={() => {
                  handleCombineBalances();
                  onSumbit();
                }}
              >
                Combine Balance
              </button>
            </div>
          )}

          {showerror && (
            <div style={{ color: "red", fontSize: "15px", margin: "5px 0" }}>
              {" "}
              {error.some((errorMessage) => errorMessage.startsWith("Address"))
                ? "Duplicated"
                : " "}
              <div
                style={{
                  border: "1px solid red",
                  borderRadius: "4px",
                  padding: "2px",
                  fontSize: "15px",
                }}
              >
                {error.map((errorMessage, index) => (
                  <p
                    key={index}
                    style={{
                      color: "red",
                    }}
                  >
                    {errorMessage}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button
            style={{
              width: "100%",
              marginTop: "3vh",
              padding: "1vw",
              backgroundColor: "Blue",
              color: "white",
              marginLeft: "3px",
            }}
            onClick={onSumbit}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Disperse;
