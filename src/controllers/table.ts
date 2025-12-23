import { Request, Response } from "express";
import Table from "../models/table";
import send_error from "../utils/send_error";
import { listNames, tableNames } from "../utils/event_names";

let listClients: any[] = [];
let tableClients: any[] = [];

export const listStream = async (req: Request, res: Response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  const tables = await Table.find();

  res.write(`data : ${JSON.stringify(tables)}\n\n`);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res,
  };

  listClients.push(newClient);

  req.on("close", () => {
    listClients = listClients.filter((client) => client.id !== clientId);
  });
};

export const tableStream = async (req: Request, res: Response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  res.write(`data : ${JSON.stringify(req.table)}\n\n`);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res,
  };

  tableClients.push(newClient);

  req.on("close", () => {
    tableClients = tableClients.filter((client) => client.id !== clientId);
  });
};

export const list = async (req: Request, res: Response) => {
  const tables = await Table.find(
    { status: "waiting" },
    { pot: 0, tableCards: 0, bigBlindIndex: 0 }
  );

  res.status(200).json(tables);
};

export const get = async (req: Request, res: Response) => {
  res.status(200).json(req.table);
};

export const create = async (req: Request, res: Response) => {
  const { name, blindPrice, raiseLimit, isFree, startingChips } = req.body;

  if (!name || !blindPrice) {
    send_error(res, 400, "Please provide a name and a blind price");
  }

  if (isFree === false && startingChips != 0) {
    send_error(res, 400, "You can only give base chips to free tables");
  }

  if (blindPrice > req.user.chips && isFree === false) {
    send_error(res, 400, "You must be able to pay the big blind of the table");
  }

  const result = await Table.insertOne({
    name: name,
    hostId: req.user._id,
    users: [req.user._id],
    blindPrice: blindPrice,
    raiseLimit: raiseLimit,
    isFree: isFree,
    chips: startingChips,
  });

  res.status(201).json(result);
};

export const join = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    send_error(res, 400, "Please provide a table id");
  }

  const table = await Table.findById(id);

  if (table == null) {
    send_error(res, 400, "Provided id does not exists");
  }

  if (table!.users.includes(req.user._id)) {
    send_error(res, 403, "You are already in the table");
  }

  if (table!.status != "waiting") {
    send_error(res, 403, "Can't join the table");
  }

  await Table.findByIdAndUpdate(id!.toLocaleString(), {
    $addToSet: { users: req.user._id },
  });

  sendToClients(tableNames.JOIN, req.user.username, tableClients);

  res.sendStatus(200);
};

export const quit = async (req: Request, res: Response) => {
  await Table.findByIdAndUpdate(req.table._id, {
    $pull: { users: req.user._id },
  });

  sendToClients(tableNames.QUIT, req.user.username, tableClients);

  res.sendStatus(200);
};

export const open = async (req: Request, res: Response) => {
  await Table.findByIdAndUpdate(req.table._id, { status: "waiting" });
  req.table.save();

  sendToClients(listNames.NEW, req.table, listClients);

  res.sendStatus(200);
};

export const start = async (req: Request, res: Response) => {
  if (req.table.users.length < 2) {
    send_error(res, 403, "You must be at least two players to start the table");
    return;
  }

  await Table.findByIdAndUpdate(req.table._id, { status: "dealing" });
  req.table.save();

  sendToClients(tableNames.START, null, tableClients);

  res.sendStatus(200);
};

export const remove = async (req: Request, res: Response) => {
  sendToClients(listNames.REMOVE, req.table._id, listClients);

  await Table.findByIdAndDelete(req.table._id);

  res.sendStatus(200);
};

function sendToClients(eventName: string, data: any, list: any[]) {
  list.forEach((c) => c.res.write(`event : ${eventName}\n`));
  list.forEach((c) => c.res.write(`data : ${JSON.stringify(data)}\n\n`));
}
