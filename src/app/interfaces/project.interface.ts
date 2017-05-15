export interface Project {
  id:number;
  name: string;
  description: string;
  effort_unit: string;
  hours_per_effort_unit: number;
  hours_per_week_and_full_time_resource: number;
}

/*{
   "id": 0,
   "name": "string",
   "description": "string",
   "effort_unit": "string",
   "hours_per_effort_unit": 0,
   "hours_per_week_and_full_time_resource": 0,
   "resources": [
     {
       "id": 0,
       "name": "string",
       "description": "string",
       "availability": 0,
       "skills": [
         {
           "id": 0,
           "name": "string",
           "description": "string"
         }
       ]
     }
   ]
 }*/
