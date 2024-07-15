const express = require("express");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/api/staff_hire", async (req, res) => {
  const {
    staffno,
    fname,
    lname,
    position,
    sex,
    dob,
    salary,
    branchno,
    telephone,
    mobile,
    email,
  } = req.body;

  try {
    const connection = await oracledb.getConnection({
      user: "dbs501_242v1a16",
      password: "44393138",
      connectString: "//localhost:1521/xe",
    });

    const result = await connection.execute(
      `INSERT INTO dh_staff (
                staffno, fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email
            ) VALUES (
                :staffno, :fname, :lname, :position, :sex, TO_DATE(:dob, 'YYYY-MM-DD'), :salary, :branchno, :telephone, :mobile, :email
            )`,
      {
        staffno,
        fname,
        lname,
        position,
        sex,
        dob,
        salary,
        branchno,
        telephone,
        mobile,
        email,
      },
      {
        autoCommit: true, // 自动提交事务
      }
    );

    await connection.close();

    res.status(200).json({ message: "Staff hired successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Failed to hire staff" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
