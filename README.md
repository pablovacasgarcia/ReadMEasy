# This is a Title

## This is a Subtitle

[This is a link]()

Hola me llamo Pablo vacas garcia

```python
<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      currentUser: null
    }
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }
};
</script>
```

```bash
npm run dev
```

1.  This is an ordered list
2.  New field
3.  New field
4.  New field

*   This is an unordered list
*   New field
*   New field
*   New field
