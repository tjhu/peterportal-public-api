import express from "express";
import { ParsedQs } from "qs";
import { WeekParams } from "types/types";
import { callWebSocAPI } from "websoc-api";

import { createErrorJSON } from "../../helpers/errors.helper";
import { getWeek } from "../../helpers/week.helper";
import { WebsocResponse } from "../../types/websoc.types";

const router = express.Router();

router.get("/soc", function (req, res) {
  (<(query: ParsedQs) => Promise<WebsocResponse>>callWebSocAPI)(req.query)
    .then((response: WebsocResponse) => {
      res.json(response);
    })
    .catch(() => {
      res
        .status(400)
        .json(
          createErrorJSON(
            400,
            "Bad Request: Invalid parameter",
            "Unable to complete websoc-api query"
          )
        );
    });
});

router.get("/week", function (req, res) {
  const query = req.query as unknown as WeekParams;
  getWeek(query.year, query.month, query.day)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json(
          createErrorJSON(
            400,
            "Bad Request: Invalid parameter",
            "Invalid year, month or day. Must include each one of year, month and day or none."
          )
        );
    });
});

export default router;
