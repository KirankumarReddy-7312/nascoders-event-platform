import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Currently it looks like this:
#           </div>
#         </div>
#                 )}
# </section>

# We want:
#                 )}
#           </div>
#         </div>
# </section>

content = content.replace(
"""          </div>
        </div>
                )}
</section>""",
"""                )}
          </div>
        </div>
</section>""")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
