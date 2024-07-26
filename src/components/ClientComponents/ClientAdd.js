import React, { useEffect, useState } from "react";
import styles from "../Form.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

function ClientAdd() {
  const [clientNo, setClientNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telno, setTelno] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [preftype, setPreftype] = useState("");
  const [maxrent, setMaxrent] = useState(0);
  const [error, setError] = useState(null);

  const [existingClientNos, setExistingClientNos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClientNos() {
      try {
        const response = await fetch(
          "http://localhost:3900/api/client/existing-clientno"
        );
        const data = await response.json();
        setExistingClientNos(data);
      } catch (error) {
        console.error("Error fetching client numbers:", error);
        setError("Failed to fetch existing client numbers");
      }
    }
    fetchClientNos();
  }, []);

  useEffect(() => {
    if (existingClientNos.length > 0) {
      setClientNo(generateClientNo());
    }
  }, [existingClientNos]);

  function generateClientNo() {
    const prefix = "C";
    let number = 1;
    let clientNo;

    do {
      const formattedNumber = number.toString().padStart(3, "0");
      clientNo = `${prefix}${formattedNumber}`;
      number++;
    } while (existingClientNos.includes(clientNo));

    return clientNo;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !clientNo ||
      !firstName ||
      !lastName ||
      !telno ||
      !street ||
      !city ||
      !email ||
      !preftype ||
      !maxrent
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const newClient = {
      clientNo,
      fname: firstName,
      lname: lastName,
      telno,
      street,
      city,
      email,
      preftype,
      maxrent: parseFloat(maxrent).toFixed(2),
    };

    try {
      const response = await fetch(
        "http://localhost:3900/api/client/client-add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new client");
      }

      navigate(`/client/add-client-confirmed/${clientNo}`);
    } catch (error) {
      setError(error.message);
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function handleCancel(e) {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <div className={styles.clientFormContainer}>
      <main className={styles.mainContent}>
        <section className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Client Add</h2>
          <form className={styles.clientForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="clientNo" className={styles.formLabel}>
                  Client No.
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={clientNo}
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.formLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="telno" className={styles.formLabel}>
                  Telephone
                </label>
                <input
                  type="text"
                  value={telno}
                  className={styles.formInput}
                  placeholder="Enter telephone"
                  onChange={(e) => setTelno(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="street" className={styles.formLabel}>
                  Street
                </label>
                <input
                  type="text"
                  value={street}
                  className={styles.formInput}
                  placeholder="Enter street"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.formLabel}>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  className={styles.formInput}
                  placeholder="Enter city"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  className={styles.formInput}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preftype" className={styles.formLabel}>
                  Preferred Type
                </label>
                <input
                  type="text"
                  value={preftype}
                  className={styles.formInput}
                  placeholder="Enter preferred type"
                  onChange={(e) => setPreftype(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="maxrent" className={styles.formLabel}>
                  Maximum Rent
                </label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="Enter maximum rent"
                  value={maxrent}
                  onChange={(e) => setMaxrent(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Button classType="submit">Add Client</Button>
              <Button classType="cancel" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
          {error && <div>Error: {error}</div>}
        </section>
      </main>
    </div>
  );
}

export default ClientAdd;