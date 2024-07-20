const express = require("express");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3900;

app.use(bodyParser.json());
app.use(cors());

app.get("/api/staff-list", async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//myoracle12c.senecacollege.ca:1521/oracle12c",
    });

    const result = await connection.execute(
      `SELECT staffno, fname, lname, position,sex,dob,salary,branchno,telephone,mobile,email FROM dh_staff`
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching staff list:", error);
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
});

app.get("/api/staff/:staffno", async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//myoracle12c.senecacollege.ca:1521/oracle12c",
    });

    const result = await connection.execute(
      `SELECT staffno, fname, lname, position,sex,dob,salary,branchno,telephone,mobile,email FROM dh_staff WHERE staffno = :placeHolder`,
      [req.params.staffno]
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching the staff:", error);
    res.status(500).json({ error: "Failed to fetch the staff" });
  }
});

app.get("/api/existing-staffno", async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//myoracle12c.senecacollege.ca:1521/oracle12c",
    });

    const result = await connection.execute(`SELECT staffno FROM dh_staff`);

    await connection.close();

    res.status(200).json(result.rows.map((row) => row[0]));
  } catch (error) {
    console.error("Error fetching staff list:", error);
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
});

app.post("/api/staff-hire", async (req, res) => {
  const {
    staffno,
    firstName,
    lastName,
    position,
    sex,
    dob,
    salary,
    branchNo,
    telephone,
    mobile,
    email,
  } = req.body;

  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//myoracle12c.senecacollege.ca:1521/oracle12c",
    });

    const result = await connection.execute(
      `BEGIN 
         Staff_hire_sp(
           :staffno, 
           :firstName, 
           :lastName, 
           :position, 
           :sex, 
           TO_DATE(:dob, 'YYYY-MM-DD'), 
           :salary, 
           :branchNo, 
           :telephone, 
           :mobile, 
           :email
         ); 
       END;`,
      {
        staffno,
        firstName,
        lastName,
        position,
        sex,
        dob,
        salary,
        branchNo,
        telephone,
        mobile,
        email,
      },
      {
        autoCommit: true,
      }
    );

    await connection.close();

    res.status(200).json({ message: "Staff hired successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Failed to hire staff" });
  }
});

app.put("/api/staff/:staffNo", async (req, res) => {
  const { salary, telephone, email } = req.body;
  const { staffNo } = req.params;

  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//myoracle12c.senecacollege.ca:1521/oracle12c",
    });

    const result = await connection.execute(
      `UPDATE dh_staff SET salary= :salary, telephone = :telephone, email = :email WHERE staffno = :staffno`,
      {
        salary,
        telephone,
        email,
        staffNo,
      },
      {
        autoCommit: true,
      }
    );

    await connection.close();
    console.log("Update result:", result);

    res.status(200).json({ message: "Staff update successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
