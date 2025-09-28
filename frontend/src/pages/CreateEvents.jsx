//codigo de prueba

import { useForm } from "react-hook-form";
import { createEvent } from '../API/api';

function CreateEvents() {
  const { register, handleSubmit, formState :{errors} } = useForm();

  const onSubmit = handleSubmit(async (data) => {
	   const res = await createEvent(data)
	   console.log(data)
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        {errors.title && <span> Rellene </span>}

        <textarea
          rows="3"
          placeholder="Description"
          {...register("description", { required: true })}
        ></textarea>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default CreateEvents