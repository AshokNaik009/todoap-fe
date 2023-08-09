import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { Button, Modal, Label, TextInput, Textarea, Dropdown, Badge } from 'flowbite-react';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };

  //New task Form State Variables
  const [tskName, settskName] = useState('');
  const [tskDesc, settskDesc] = useState('');
  const [tskDueDate, setDueDate] = useState('');
  const [tskStatus, settskStatus] = useState('');


  const [tskEdit, settskEdit] = useState('');



  //add new todo item to database
  const addTsks = async () => {

    if(tskName.length === 0) {
        toast.error("Task name is Required");
        return
    }


    let tskObj = {
      taskname: tskName,
      description: tskDesc,
      deadlineDate: tskDueDate
    }
    try {
      const res = await axios.post('https://sample-todoapp.onrender.com/api-v1/addTasks', tskObj)

      if(res.data) {
        setListItems(prev => [...prev, res.data.data.data]);

      props.setOpenModal(undefined)
      settskName('');
      settskDesc('');
      setDueDate('');
      toast.success("New Task Added!");
      getItemsList();
      }
      


    } catch (err) {
      console.log(err);
    }
  }



  const reneditTsks = async (e) => {

  
    settskName(e.taskname);
    settskDesc(e.description);
    setDueDate(new Date(e.deadlineDate).toISOString().split('T')[0]);

    console.log(e.status);
    settskStatus(e.status)
    settskEdit(e);
    props.setOpenModal('dismissible')


  }



  const submitEditTsks = async () => {
 
    if(tskName.length === 0) {
      toast.error("Task name is Required");
      return
  }

    let tskObj = {
      _id: tskEdit._id,
      taskname: tskName,
      description: tskDesc,
      deadlineDate: tskDueDate,
      status: tskStatus
    }
    try {
      const res = await axios.put('https://sample-todoapp.onrender.com/api-v1/updateTasks', tskObj)
      setListItems(prev => [...prev, res.data.data.data]);

      if(res.data.data != null) {
        props.setOpenModal(undefined)
        settskName('');
        settskDesc('');
        setDueDate('');
        settskEdit('');
        settskStatus('');
        getItemsList();
  
        toast.success("Task updated!");
      } 
     

    } catch (err) {
      console.log(err);
      toast.error("Something went Wrong");
    }
  }


  const closeModal = () => {
    settskName('');
    settskDesc('');
    setDueDate('');
    settskEdit('');
    settskStatus('');
    props.setOpenModal(undefined);
  }







  const getItemsList = async () => {
    try {
      const res = await axios.get('https://sample-todoapp.onrender.com/api-v1/fetchTasks');


      if (res.data.data) {
        setListItems(res.data.data.data);
      } else {
        setListItems([]);
      }


      console.log('render')
    } catch (err) {
      console.log(err);
    }
  }


  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(() => {

    getItemsList()
  }, []);



  const dltItem = async (e) => {

    console.log(e)

    let tskObj = {
      _id: e._id,
      taskname: e.taskname,
      description: e.description,
      deadlineDate: e.deadlineDate,
      isDeleted: true
    }

    try {
      const res = await axios.put(`https://sample-todoapp.onrender.com/api-v1/updateTasks`, tskObj)
      // console.log(res.data)
      console.log("Item deleted display toast");
      toast.success("Task Deleted!");
      getItemsList()
    } catch (err) {
      console.log(err);
    }

  }





  return (
    <>



      <div className=" flex flex-col items-center ">
        <h1 className=" text-4xl m-16 font-bold"> Todo App</h1>
        <div className="p-6">



          <Button className=" bg-green-500 text-white p-3 m-3 rounded-md font-bold hover:bg-green-600" onClick={() => props.setOpenModal('dismissible')} >
            Add Tasks
          </Button>
        </div>
        <div>
          {listItems?.length > 0 ? (
            <ul>
              {
                listItems.map((task, index) => (
                  <div
                    className={
                      task?.status === "pending"
                      ?
                      'mt-2 block w-80 rounded-lg bg-white text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700'
                      :
                      'mt-2 block w-80 rounded-lg bg-slate-300 text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700'
                    }

                     >
                    <div className="p-6">
                      <h5
                        className="mb-1 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                        {task?.taskname}
                      </h5>
                      <h6
                        className="mb-2 text-base font-medium leading-tight text-neutral-500 dark:text-neutral-50">
                        {task?.description}
                        <br />
                        Deadline: {new Date(task?.deadlineDate).toDateString()}
                      </h6>
                      <p
                        className="mb-4 text-base  leading-normal text-neutral-600 dark:text-neutral-200">
                        {
                          task?.status === "pending" &&
                          <Label>
                            Pending
                          </Label>
                        }

                        {
                          task?.status === "completed" &&
                          <Label>
                          Completed
                        </Label>
                        }
                      </p>


                      <button onClick={() => { reneditTsks(task) }}
                        className=" bg-blue-300 text-white p-2 mx-1 rounded-md font-bold hover:bg-blue-700">
                        <svg className="w-6 h-6 text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279" />
                        </svg>
                      </button>


                      <button onClick={() => dltItem(task)}
                        className=" bg-red-500 text-white p-2 mx-1 rounded-md font-bold hover:bg-red-600">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                        </svg>
                      </button>


                    </div>
                  </div>


                ))
              }
            </ul>
          ) : (
            <div>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400" >No Task Found</p>
            </div>
          )}
        </div>
      </div>











      <Modal size="md" dismissible show={props.openModal === 'dismissible'} onClose={() => closeModal()}>
        <Modal.Header>  {tskEdit != '' ? 'Edit task' : 'Add a New task'}      </Modal.Header>
        <Modal.Body>


          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="Task Name"
                  value="Task Name"
                />
              </div>
              <TextInput
                id="taskname"
                placeholder="Enter Task Name"
                required
                shadow
                type="text"
                value={tskName}
                onChange={(e) => { settskName(e.target.value) }}
              />
            </div>
            <div
              className="max-w-md"
              id="textarea"
            >
              <div className="mb-2 block">
                <Label
                  htmlFor="comment"
                  value="Description"
                />
              </div>
              <Textarea
                id="comment"
                placeholder="Describe the task"
                required
                rows={4}
                value={tskDesc}
                onChange={(e) => { settskDesc(e.target.value) }}
              />
            </div>


            {
              tskEdit != '' &&
              <>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="Status"
                      value="Status"
                    />
                  </div>

                  <Dropdown

                    label={tskStatus}
                  >

                    <Dropdown.Item onClick={() => { settskStatus('pending') }} value={'pending'} >
                      Pending
                    </Dropdown.Item >
                    <Dropdown.Item onClick={() => { settskStatus('completed') }} value={'completed'}   >
                      Completed
                    </Dropdown.Item >

                  </Dropdown>





                </div>
              </>
            }


            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="Due Date"
                  value="Due Date"
                />
              </div>
              <TextInput
                id="duedate"
                placeholder="dd-mm-yyyy"
                required
                shadow
                type="date"
                value={tskDueDate}
                onChange={(e) => { setDueDate(e.target.value) }}


              />
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>


          {
            tskEdit != '' ?

              (<Button onClick={submitEditTsks}>Edit Task</Button>)


              :

              (<Button onClick={addTsks}>Submit</Button>)




          }

          <Button color="gray" onClick={() => closeModal()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal >




    </>

  );
}

export default App;
