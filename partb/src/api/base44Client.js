export const base44 = {

  entities: {

    Conversation: {

      async list(sort = "-updated_date") {
        const res = await fetch("/api/conversations?sort=" + sort);
        return res.json();
      },

      async filter(params) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch("/api/conversations/filter?" + query);
        return res.json();
      },

      async update(id, data) {
        const res = await fetch("/api/conversations/" + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        return res.json();
      },

      async delete(id) {
        const res = await fetch("/api/conversations/" + id, {
          method: "DELETE"
        });

        return res.json();
      }
    }
  },

  integrations: {
    Core: {
      async InvokeLLM(payload) {
        const res = await fetch("/api/invokeLLM", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        return res.json();
      }
    }
  }

};
