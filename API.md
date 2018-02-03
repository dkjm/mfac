# API documentation

## ======= Incomplete =======

**Fetch meetings**
----
  Returns list of all meetings.

* **URL**

  /api/meetings/

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
  
  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
    [
      {
        id: 1, 
        title: "Coop meeting",
        alloted_duration: 10,
        created_on: "2018-01-29T08:50:45.746601Z",
        started_on: "2018-01-29T08:50:45.746601Z",
        ended_on: "2018-01-29T10:50:45.746601Z",
        version: 2,
        participants: [],
        resources: [],
        agenda_items: [],
        owner: {},
      }
    ]
    ```
 
* **Error Response:**

  * None

* **Sample Call:**

  ```javascript w/ axios
    axios.get('api/meetings/');
  ```