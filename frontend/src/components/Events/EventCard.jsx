const EventCard = ({month,day,title,time,note,verse} ) => {
  return (
    <div className="h-70 w-153 rounded shadow-lg bg-white flex text-black">
      
      <div className="h-full w-25 text-center font-bold border-r pr-5">
        <h1 className="pt-8 text-xl">{month}</h1>
        <hr />
        <h1 className="text-5xl">{day} </h1>
      </div>

      <div className="flex-1 border-b border-black pl-5">
        <h1 className="font-bold text-3xl">{title}</h1>
        <h1 className="font-bold text-2xl">{time}</h1>
        <p>{note} </p>

        <div className="mt-6 italic border-t">
          {verse}
        </div>
      </div>

    </div>
  );
};

export default EventCard;
