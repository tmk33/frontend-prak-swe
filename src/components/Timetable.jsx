import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';


    const fetchMitarbeiter = async () => {
        try {
          const res = await axios.get('/mitarbeiter'); // Không cần token
          console.log(res.data); // Dữ liệu nhân viên
        } catch (error) {
          console.error("Error fetching mitarbeiter:", error);
        }
      };


export default fetchMitarbeiter;
