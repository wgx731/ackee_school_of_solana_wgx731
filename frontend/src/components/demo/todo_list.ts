/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/todo_list.json`.
 */
export type TodoList = {
  "address": "CgigwV8UUzQiRHaMMgmXJ1u9bmq36xiASqjJRqKZgaWE",
  "metadata": {
    "name": "todoList",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createTodo",
      "discriminator": [
        250,
        161,
        142,
        148,
        131,
        48,
        194,
        181
      ],
      "accounts": [
        {
          "name": "todoAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "todo",
          "writable": true
        },
        {
          "name": "todoList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "todo_list.date [.. DATE_LENGTH as usize]",
                "account": "todoList"
              },
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  68,
                  79,
                  95,
                  76,
                  73,
                  83,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "todo_list.list_author",
                "account": "todoList"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "todoContent",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteTodo",
      "discriminator": [
        224,
        212,
        234,
        177,
        90,
        57,
        219,
        115
      ],
      "accounts": [
        {
          "name": "todoAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "todo",
          "writable": true
        },
        {
          "name": "todoList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "todo_list.date [.. DATE_LENGTH as usize]",
                "account": "todoList"
              },
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  68,
                  79,
                  95,
                  76,
                  73,
                  83,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "todo_list.list_author",
                "account": "todoList"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "listAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "todoList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "dateStr"
              },
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  68,
                  79,
                  95,
                  76,
                  73,
                  83,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "listAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "dateStr",
          "type": "string"
        }
      ]
    },
    {
      "name": "markTodoDone",
      "discriminator": [
        188,
        30,
        204,
        216,
        30,
        235,
        33,
        45
      ],
      "accounts": [
        {
          "name": "todoAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "todo",
          "writable": true
        },
        {
          "name": "todoList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "todo_list.date [.. DATE_LENGTH as usize]",
                "account": "todoList"
              },
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  68,
                  79,
                  95,
                  76,
                  73,
                  83,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "todo_list.list_author",
                "account": "todoList"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "markTodoNotDone",
      "discriminator": [
        19,
        65,
        8,
        27,
        79,
        172,
        68,
        118
      ],
      "accounts": [
        {
          "name": "todoAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "todo",
          "writable": true
        },
        {
          "name": "todoList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "todo_list.date [.. DATE_LENGTH as usize]",
                "account": "todoList"
              },
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  68,
                  79,
                  95,
                  76,
                  73,
                  83,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "todo_list.list_author",
                "account": "todoList"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "todo",
      "discriminator": [
        137,
        179,
        206,
        68,
        34,
        36,
        131,
        54
      ]
    },
    {
      "name": "todoList",
      "discriminator": [
        237,
        16,
        56,
        14,
        45,
        138,
        67,
        245
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidDate",
      "msg": "cannot initialize, invalid date"
    },
    {
      "code": 6001,
      "name": "todoContentTooLong",
      "msg": "cannot create todo, content too long"
    },
    {
      "code": 6002,
      "name": "maxTodoReached",
      "msg": "cannot create todo, max todos reached"
    },
    {
      "code": 6003,
      "name": "minTodoReached",
      "msg": "cannot remove todo, no todos left"
    },
    {
      "code": 6004,
      "name": "alreadyExpired",
      "msg": "cannot mark todo status, todo list expired"
    },
    {
      "code": 6005,
      "name": "alreadyDone",
      "msg": "cannot mark todo status, todo already done"
    },
    {
      "code": 6006,
      "name": "alreadyNotDone",
      "msg": "cannot mark todo status, todo already not done"
    }
  ],
  "types": [
    {
      "name": "statusType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "done"
          },
          {
            "name": "notDone"
          }
        ]
      }
    },
    {
      "name": "todo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "todoAuthor",
            "type": "pubkey"
          },
          {
            "name": "parentList",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": {
              "array": [
                "u8",
                500
              ]
            }
          },
          {
            "name": "contentLength",
            "type": "u16"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "statusType"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "todoList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listAuthor",
            "type": "pubkey"
          },
          {
            "name": "date",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "todosCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
